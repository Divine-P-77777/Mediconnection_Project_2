# Hackathon Pitch Deck: CivicPulse ⚖️
**Theme:** AI for Bharat (Powered by AWS)

---

## 1. Vision & Problem Statement
*   **The Problem:** 80% of Indians face a "Legal Literacy Gap" due to complex legalese and language barriers.
*   **The Solution:** An AI-powered legal advocate that simplifies complex documents into conversational regional languages via **Live Mode** (Visual/Voice) and **Chat Mode** (Deep Analysis).

---

## 2. Technical Architecture (The AWS Pipeline)

### Data Flow
1.  **Storage:** Documents are stored in **Amazon S3** with strict access controls.
2.  **OCR Hybrid Engine:** Primary extraction via **Amazon Textract**. Automatic fallback to **Local Pytesseract** upon reaching free-tier thresholds (900 pages/mo).
3.  **Embeddings:** Text chunks (800 chars) are vectorized using **Amazon Bedrock (Titan Embeddings v1)**.
4.  **Vector Store:** Vectors are indexed in **Amazon OpenSearch** with metadata-driven isolation.
5.  **Reasoning:** **Amazon Bedrock (Claude 3 Sonnet)** handles legal reasoning and simplification.
6.  **Indian Touch (TTS):** **Sarvam AI (Ritu Voice)** for authentic Hindi synthesis with **Edge-TTS** as a circuit-breaker.

---

## 3. Deep-Dive: Ingestion & Segregation

### A. Trusted Knowledge (Admin)
*   **Sources:** Automated scraping of `indiacode.nic.in`, `prsindia.org`, `clc.gov.in` using BeautifulSoup4.
*   **Logic:** Tagged with `source_type: "global"`.
*   **Safety:** Ensures users get answers based on actual Indian law, not LLM hallucinations.

### B. Personal Case Files (User)
*   **Logic:** Tagged with `source_type: "private"` and `uploaded_by: user_id`.
*   **Privacy:** Isolated at the query level; one user can never see or search another's documents.

---

## 4. Technical Snippets (Source of Truth)

### Multi-Tenant Vector Search (Query-Level)
We use a boolean filter strategy to ensure RAG context includes *both* general law and student/user-specific documents without cross-contamination.
```python
# app/services/vector_service.py
search_query = {
    "query": {
        "bool": {
            "must": [{"knn": {"vector": {"vector": query_vector, "k": 5}}}],
            "filter": {
                "bool": {
                    "should": [
                        {"term": {"metadata.source_type.keyword": "global"}}, # Trusted Law
                        {"bool": { # Your Private Documents
                            "must": [
                                {"term": {"metadata.source_type.keyword": "private"}},
                                {"term": {"metadata.uploaded_by.keyword": user_id}}
                            ]
                        }}
                    ]
                }
            }
        }
    }
}
```

### Intelligent OCR Gatekeeper (Fallback)
To survive AWS Textract free-tier exhaustion, we implemented a usage-aware gatekeeper.
```python
# app/core/ocr_gatekeeper.py
def should_use_local_ocr():
    usage = get_monthly_usage_from_dynamodb()
    THRESHOLD = 900 # AWS Free Tier Page Limit
    return usage >= THRESHOLD

# Ingestion Flow:
if should_use_local_ocr():
    # pdfplumber for digital files, pytesseract for scanned images
    text, pages = ocr_service.extract_text_local(file_path)
else:
    text = textract_service.extract_text_from_s3(bucket, key)
```

---

## 5. Critical Challenges & Resolutions
1.  **The "Hidden Fee" of Success:** Textract free tier is limited. We built a custom **Usage Tracker** in DynamoDB to trigger the Pytesseract fallback.
2.  **Hallucination Control:** By segregating metadata ([global](file:///c:/civicpulse/civicpulse-backend/app/main.py#66-76) vs `private`), we prevented the AI from confusing general constitutional law with a specific user's rent agreement.
3.  **The "Indian Touch":** Standard TTS sounds robotic. We integrated **Sarvam AI (Ritu)** to provide a warm, culturally resonant Hindi voice for rural users.
4.  **Real-Time Processing:** Large legal files take time to analyze. We used **WebSockets (Socket.IO)** to stream real-time progress percentages (e.g., "60%: Generating Embeddings...") to keep the UX alive.
5.  **Camera API Limitations:** Browsers prevent deep camera control; we implemented a **Canvas-based capture system** to feed frames to the OCR pipeline for Live Mode.

---

## 6. Future Scope
*   **Hyper-Local Dialects:** Expanding Sarvam AI integration to support Bengali, Tamil, and Marathi.
*   **Court Date Tracking:** Integration with e-Courts API to provide automatic reminders to users.
*   **Community Drafting:** Enabling collaborative drafting of civic petitions.
