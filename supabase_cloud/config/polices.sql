[
  {
    "schemaname": "public",
    "tablename": "account_details_healthcenter",
    "policyname": "Health center can delete its own account details",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "account_details_healthcenter",
    "policyname": "Health center can insert its own account details",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))"
  },
  {
    "schemaname": "public",
    "tablename": "account_details_healthcenter",
    "policyname": "Health center can update its own account details",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))"
  },
  {
    "schemaname": "public",
    "tablename": "account_details_healthcenter",
    "policyname": "Health center can view its own account details",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "account_details_healthcenter",
    "policyname": "Super admins have full access to account details",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "ALL",
    "qual": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text))))",
    "with_check": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text))))"
  },
  {
    "schemaname": "public",
    "tablename": "doctors",
    "policyname": "doctor_create_by_health_center",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid()) AND (hc.approved = true))))"
  },
  {
    "schemaname": "public",
    "tablename": "doctors",
    "policyname": "doctor_delete_owner_or_admin",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "((EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "doctors",
    "policyname": "doctor_read",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text) OR (approved = true))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "doctors",
    "policyname": "doctor_update_owner_or_admin",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "health_centers",
    "policyname": "health_center_create_own",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "(user_id = auth.uid())"
  },
  {
    "schemaname": "public",
    "tablename": "health_centers",
    "policyname": "health_center_delete_admin_only",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "DELETE",
    "qual": "((auth.jwt() ->> 'role'::text) = 'super_admin'::text)",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "health_centers",
    "policyname": "health_center_read",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text) OR (approved = true))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "health_centers",
    "policyname": "health_center_update_owner_or_admin",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "liveconsult",
    "policyname": "User/Doctor/Admin can read consults",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "((user_id = auth.uid()) OR (doctor_id = auth.uid()) OR is_super_admin())",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "liveconsult",
    "policyname": "User/Doctor/Admin update allowed consults",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "UPDATE",
    "qual": "((user_id = auth.uid()) OR (doctor_id = auth.uid()) OR is_super_admin())",
    "with_check": "((user_id = auth.uid()) OR (doctor_id = auth.uid()) OR is_super_admin())"
  },
  {
    "schemaname": "public",
    "tablename": "liveconsult",
    "policyname": "Users create their own consult",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "((user_id = auth.uid()) OR is_super_admin())"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "profiles_no_direct_insert",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "INSERT",
    "qual": null,
    "with_check": "false"
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "profiles_select_own_or_admin",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "SELECT",
    "qual": "((id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check": null
  },
  {
    "schemaname": "public",
    "tablename": "profiles",
    "policyname": "profiles_update_own_or_admin",
    "permissive": "PERMISSIVE",
    "roles": "{public}",
    "cmd": "UPDATE",
    "qual": "((id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check": null
  }
]


[
  {
    "table_name": "account_details_doctors",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "account_details_healthcenter",
    "rls_enabled": true,
    "rls_forced": false
  },
  {
    "table_name": "appointments",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "doctor_availability",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "doctor_services",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "doctors",
    "rls_enabled": true,
    "rls_forced": false
  },
  {
    "table_name": "health_center_availability",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "health_center_services",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "health_centers",
    "rls_enabled": true,
    "rls_forced": false
  },
  {
    "table_name": "liveconsult",
    "rls_enabled": true,
    "rls_forced": false
  },
  {
    "table_name": "payment_appointments",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "payment_liveconsult",
    "rls_enabled": false,
    "rls_forced": false
  },
  {
    "table_name": "profiles",
    "rls_enabled": true,
    "rls_forced": false
  }
]


[
  {
    "policyname": "Documents are accessible by owner",
    "tablename": "objects",
    "permissive": "PERMISSIVE",
    "roles": "{authenticated}",
    "cmd": "SELECT",
    "qual": "((auth.uid())::text = (storage.foldername(name))[1])",
    "with_check": null
  }
]