{
    "buckets": [
        {
            "id": "documents",
            "name": "documents",
            "public": false,
            "created_at": "2025-03-27T20:34:08.874349+00:00",
            "file_size_limit": null,
            "allowed_mime_types": null
        }
    ],
    "storage_policies": [
        {
            "roles": [
                "authenticated"
            ],
            "command": "SELECT",
            "table_name": "objects",
            "policy_name": "Documents are accessible by owner",
            "using_condition": "((auth.uid())::text = (storage.foldername(name))[1])",
            "with_check_condition": null
        }
    ]
}