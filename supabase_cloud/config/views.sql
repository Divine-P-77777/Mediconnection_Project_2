[
  {
    "view_name": "approved_health_centers",
    "view_definition": " SELECT health_centers.id,\n    health_centers.user_id,\n    health_centers.hcrn_hfc,\n    health_centers.name,\n    health_centers.address,\n    health_centers.phone,\n    health_centers.pincode,\n    health_centers.approved,\n    health_centers.created_at,\n    health_centers.document_proof,\n    health_centers.email\n   FROM health_centers\n  WHERE (health_centers.approved = true);"
  }
]