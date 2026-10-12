{
    "triggers": [
    ],
    "functions": [
        {
            "language": "sql",
            "security": "SECURITY INVOKER",
            "arguments": "",
            "definition": "CREATE OR REPLACE FUNCTION public.\"current_role\"()\n RETURNS text\n LANGUAGE sql\n STABLE\nAS $function$\r\n  select role\r\n  from public.profiles\r\n  where id = auth.uid();\r\n$function$\n",
            "return_type": "text",
            "function_name": "current_role"
        },
        {
            "language": "plpgsql",
            "security": "SECURITY INVOKER",
            "arguments": "event jsonb",
            "definition": "CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)\n RETURNS jsonb\n LANGUAGE plpgsql\n STABLE\nAS $function$\r\nDECLARE\r\n  claims jsonb;\r\n  user_role text;\r\nBEGIN\r\n  -- Read existing claims\r\n  claims := event->'claims';\r\n\r\n  -- Fetch role from profiles table\r\n  SELECT role INTO user_role\r\n  FROM public.profiles\r\n  WHERE id = (event->>'user_id')::uuid;\r\n\r\n  -- Add custom claim\r\n  claims := jsonb_set(\r\n    claims,\r\n    '{role}',\r\n    to_jsonb(user_role),\r\n    true\r\n  );\r\n\r\n  -- Put claims back\r\n  event := jsonb_set(event, '{claims}', claims, true);\r\n\r\n  RETURN event;\r\nEND;\r\n$function$\n",
            "return_type": "jsonb",
            "function_name": "custom_access_token_hook"
        },
        {
            "language": "plpgsql",
            "security": "SECURITY DEFINER",
            "arguments": "",
            "definition": "CREATE OR REPLACE FUNCTION public.handle_new_user()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$declare\r\n  user_role text;\r\n  full_name text;\r\n  first_name text;\r\n  last_name text;\r\nbegin\r\n  user_role := lower(coalesce(new.raw_user_meta_data->>'role', 'user'));\r\n  full_name := coalesce(new.raw_user_meta_data->>'full_name', '');\r\n\r\n  first_name := nullif(split_part(full_name, ' ', 1), '');\r\n  last_name := nullif(split_part(full_name, ' ', 2), '');\r\n\r\n  insert into public.profiles (\r\n    id,\r\n    role,\r\n    first_name,\r\n    last_name,\r\n    username,\r\n    health_center_name,\r\n    pincode,\r\n    official_email,\r\n    contact_number,\r\n    address,\r\n    metadata,\r\n    hcrn_hfc,\r\n    created_at\r\n  )\r\n  values (\r\n    new.id,\r\n    user_role,\r\n    first_name,\r\n    last_name,\r\n    new.raw_user_meta_data->>'username',\r\n    case when user_role = 'health_center' then full_name else null end,\r\n    new.raw_user_meta_data->>'pincode',\r\n    new.email,\r\n    new.raw_user_meta_data->>'contact',\r\n    new.raw_user_meta_data->>'address',\r\n    new.raw_user_meta_data,\r\n    new.raw_user_meta_data->>'hcrn_hfc',\r\n    now()\r\n  )\r\n  on conflict (id) do nothing;\r\n\r\n  return new;\r\nend;$function$\n",
            "return_type": "trigger",
            "function_name": "handle_new_user"
        },
        {
            "language": "sql",
            "security": "SECURITY INVOKER",
            "arguments": "",
            "definition": "CREATE OR REPLACE FUNCTION public.is_super_admin()\n RETURNS boolean\n LANGUAGE sql\n STABLE\nAS $function$\r\n  select exists (\r\n    select 1\r\n    from public.profiles\r\n    where id = auth.uid()\r\n      and role = 'super_admin'\r\n  );\r\n$function$\n",
            "return_type": "boolean",
            "function_name": "is_super_admin"
        },
        {
            "language": "plpgsql",
            "security": "SECURITY INVOKER",
            "arguments": "",
            "definition": "CREATE OR REPLACE FUNCTION public.set_center_id()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nbegin\r\n  if new.center_id is null then\r\n    new.center_id := auth.uid();\r\n  end if;\r\n  return new;\r\nend;\r\n$function$\n",
            "return_type": "trigger",
            "function_name": "set_center_id"
        },
        {
            "language": "plpgsql",
            "security": "SECURITY DEFINER",
            "arguments": "p_id bigint, p_prescriptions text[], p_reports text[], p_status text, p_meet_url text, p_bills text[]",
            "definition": "CREATE OR REPLACE FUNCTION public.user_update_liveconsult(p_id bigint, p_prescriptions text[], p_reports text[], p_status text, p_meet_url text, p_bills text[])\n RETURNS liveconsult\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\r\ndeclare\r\n  v_row liveconsult;\r\nbegin\r\n  update public.liveconsult\r\n  set\r\n    prescriptions    = p_prescriptions,\r\n    reports          = p_reports,\r\n    status           = p_status,\r\n    meet_url         = p_meet_url,\r\n    bills            = p_bills\r\n  where id = p_id\r\n    and user_id = auth.uid()\r\n  returning * into v_row;\r\n\r\n  if not found then\r\n    raise exception 'Not allowed or consult not found';\r\n  end if;\r\n\r\n  return v_row;\r\nend;\r\n$function$\n",
            "return_type": "liveconsult",
            "function_name": "user_update_liveconsult"
        }
    ]
}