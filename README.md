# 🏥 Mediconnect  

Mediconnect is a healthcare workflow platform built with **Next.js**, **Supabase**, and **Cloudinary**.  
It streamlines the process of **health center registration, admin approval, doctor management, and patient consultations** with secure role-based access.  

---

## 🚀 Features  
- Health center onboarding & admin approval system  
- Secure role-based authentication (Super Admin, Health Center, Doctor, User)  
- Real-time dashboards powered by Supabase  
- Document & report uploads with Cloudinary  
- Responsive UI with Next.js and TailwindCSS  

---

## 🛠️ Tech Stack  
- **Next.js (JavaScript)** – Frontend & API Routes  
- **Supabase** – Authentication, Database, RLS Policies  
- **Cloudinary** – Media & Document Storage  
- **Tailwind CSS** – Modern UI Styling  

---

## ⚙️ Setup Instructions  

### 1️⃣ Clone the Repository  
```bash
https://github.com/Divine-P-77777/Mediconnection_Project_2.git .
```

Install Dependencies
```
npm install
```

Configure Environment Variables
Create a file named .env.local in the frontend directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=*********
NEXT_PUBLIC_SUPABASE_ANON_KEY=*********

CLOUD_NAME=*********
CLOUDINARY_URL=*********

NEXT_PUBLIC_GOOGLE_CLIENT_ID=*********
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=*********

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=*********
NEXT_PUBLIC_SUPER_ADMINS=your-super-admin-email@example.com
```
For backend or admin usage, create a .env file and add:
```
SUPABASE_SERVICE_ROLE_KEY=*********
CLOUDINARY_API_KEY=*********
CLOUDINARY_API_SECRET=*********
SUPABASE_URL=*********

```
Run the Development Server
```
npm run dev
```

The app should now be running at http://localhost:3000


🔐 Authentication & Roles

Super Admin – Approves health centers
Health Center – Manages doctors & patients
Doctor – Handles consultations
User/Patient – Books appointments, downloads reports


📜 License
This project is licensed under the MIT License.
You’re free to use, modify, and distribute it with proper attribution.
