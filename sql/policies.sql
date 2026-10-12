[
  {
    "table_name": "account_details_healthcenter",
    "policy_name": "Health center can delete its own account details",
    "command": "DELETE",
    "roles": "{public}",
    "using_condition": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))",
    "with_check_condition": null
  },
  {
    "table_name": "account_details_healthcenter",
    "policy_name": "Health center can insert its own account details",
    "command": "INSERT",
    "roles": "{public}",
    "using_condition": null,
    "with_check_condition": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))"
  },
  {
    "table_name": "account_details_healthcenter",
    "policy_name": "Health center can update its own account details",
    "command": "UPDATE",
    "roles": "{public}",
    "using_condition": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))",
    "with_check_condition": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))"
  },
  {
    "table_name": "account_details_healthcenter",
    "policy_name": "Health center can view its own account details",
    "command": "SELECT",
    "roles": "{public}",
    "using_condition": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = account_details_healthcenter.health_center_id) AND (hc.user_id = auth.uid()))))",
    "with_check_condition": null
  },
  {
    "table_name": "account_details_healthcenter",
    "policy_name": "Super admins have full access to account details",
    "command": "ALL",
    "roles": "{public}",
    "using_condition": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text))))",
    "with_check_condition": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text))))"
  },
  {
    "table_name": "doctors",
    "policy_name": "doctor_create_by_health_center",
    "command": "INSERT",
    "roles": "{public}",
    "using_condition": null,
    "with_check_condition": "(EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid()) AND (hc.approved = true))))"
  },
  {
    "table_name": "doctors",
    "policy_name": "doctor_delete_owner_or_admin",
    "command": "DELETE",
    "roles": "{public}",
    "using_condition": "((EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check_condition": null
  },
  {
    "table_name": "doctors",
    "policy_name": "doctor_read",
    "command": "SELECT",
    "roles": "{public}",
    "using_condition": "((EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text) OR (approved = true))",
    "with_check_condition": null
  },
  {
    "table_name": "doctors",
    "policy_name": "doctor_update_owner_or_admin",
    "command": "UPDATE",
    "roles": "{public}",
    "using_condition": "((EXISTS ( SELECT 1\n   FROM health_centers hc\n  WHERE ((hc.id = doctors.health_center_id) AND (hc.user_id = auth.uid())))) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check_condition": null
  },
  {
    "table_name": "health_centers",
    "policy_name": "health_center_create_own",
    "command": "INSERT",
    "roles": "{public}",
    "using_condition": null,
    "with_check_condition": "(user_id = auth.uid())"
  },
  {
    "table_name": "health_centers",
    "policy_name": "health_center_delete_admin_only",
    "command": "DELETE",
    "roles": "{public}",
    "using_condition": "((auth.jwt() ->> 'role'::text) = 'super_admin'::text)",
    "with_check_condition": null
  },
  {
    "table_name": "health_centers",
    "policy_name": "health_center_read",
    "command": "SELECT",
    "roles": "{public}",
    "using_condition": "((user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text) OR (approved = true))",
    "with_check_condition": null
  },
  {
    "table_name": "health_centers",
    "policy_name": "health_center_update_owner_or_admin",
    "command": "UPDATE",
    "roles": "{public}",
    "using_condition": "((user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check_condition": null
  },
  {
    "table_name": "liveconsult",
    "policy_name": "User/Doctor/Admin can read consults",
    "command": "SELECT",
    "roles": "{authenticated}",
    "using_condition": "((user_id = auth.uid()) OR (doctor_id = auth.uid()) OR is_super_admin())",
    "with_check_condition": null
  },
  {
    "table_name": "liveconsult",
    "policy_name": "User/Doctor/Admin update allowed consults",
    "command": "UPDATE",
    "roles": "{authenticated}",
    "using_condition": "((user_id = auth.uid()) OR (doctor_id = auth.uid()) OR is_super_admin())",
    "with_check_condition": "((user_id = auth.uid()) OR (doctor_id = auth.uid()) OR is_super_admin())"
  },
  {
    "table_name": "liveconsult",
    "policy_name": "Users create their own consult",
    "command": "INSERT",
    "roles": "{authenticated}",
    "using_condition": null,
    "with_check_condition": "((user_id = auth.uid()) OR is_super_admin())"
  },
  {
    "table_name": "profiles",
    "policy_name": "profiles_no_direct_insert",
    "command": "INSERT",
    "roles": "{public}",
    "using_condition": null,
    "with_check_condition": "false"
  },
  {
    "table_name": "profiles",
    "policy_name": "profiles_select_own_or_admin",
    "command": "SELECT",
    "roles": "{public}",
    "using_condition": "((id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check_condition": null
  },
  {
    "table_name": "profiles",
    "policy_name": "profiles_update_own_or_admin",
    "command": "UPDATE",
    "roles": "{public}",
    "using_condition": "((id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'super_admin'::text))",
    "with_check_condition": null
  }
]