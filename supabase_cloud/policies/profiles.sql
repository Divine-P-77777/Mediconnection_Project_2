[
  {
    "policy_name": "Allow self profile insert",
    "command": "a",
    "is_permissive": true,
    "using_expression": null,
    "with_check_expression": "(auth.uid() = id)",
    "applied_role": null
  },
  {
    "policy_name": "Allow users to update their own profile",
    "command": "w",
    "is_permissive": true,
    "using_expression": "(auth.uid() = id)",
    "with_check_expression": "(auth.uid() = id)",
    "applied_role": null
  },
  {
    "policy_name": "Authenticated users can read their own profile",
    "command": "r",
    "is_permissive": true,
    "using_expression": "(auth.uid() = id)",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "Super admins can update any profile",
    "command": "w",
    "is_permissive": true,
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles profiles_1\n  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'super_admin'::text))))",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "Super admins can view all profiles",
    "command": "r",
    "is_permissive": true,
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles profiles_1\n  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'super_admin'::text))))",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "Users can view their own profile",
    "command": "r",
    "is_permissive": true,
    "using_expression": "(auth.uid() = id)",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "health center view doctors",
    "command": "r",
    "is_permissive": true,
    "using_expression": "((role = 'doctor'::text) AND (EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'health_center'::text)))))",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "own profile view",
    "command": "r",
    "is_permissive": true,
    "using_expression": "(auth.uid() = id)",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "read_own_profile",
    "command": "r",
    "is_permissive": true,
    "using_expression": "(auth.uid() = id)",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "read_profiles_for_doctor_policies",
    "command": "r",
    "is_permissive": true,
    "using_expression": "true",
    "with_check_expression": null,
    "applied_role": null
  },
  {
    "policy_name": "super admin view all",
    "command": "r",
    "is_permissive": true,
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles p\n  WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text))))",
    "with_check_expression": null,
    "applied_role": null
  }
]