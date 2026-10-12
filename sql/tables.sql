[
  {
    "table_name": "account_details_doctors",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.account_details_doctors (\n    id bigint NOT NULL DEFAULT nextval('account_details_doctors_id_seq'::regclass),\n    doctor_id uuid NOT NULL,\n    account_number text NOT NULL,\n    bank_name text NOT NULL,\n    ifsc_code text NOT NULL,\n    created_at timestamp without time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "account_details_healthcenter",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.account_details_healthcenter (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    health_center_id uuid NOT NULL,\n    account_number text NOT NULL,\n    ifsc_code text,\n    bank_name text,\n    created_at timestamp with time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "appointments",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.appointments (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    center_id uuid NOT NULL,\n    user_id uuid NOT NULL,\n    date date NOT NULL,\n    \"time\" text NOT NULL,\n    purpose text NOT NULL,\n    reports text[] DEFAULT '{}'::text[],\n    bills text[] DEFAULT '{}'::text[],\n    created_at timestamp with time zone DEFAULT now(),\n    status text DEFAULT 'pending'::text,\n    center_name text,\n    user_name text,\n    phone text,\n    gender text,\n    dob date,\n    prescriptions text[] DEFAULT '{}'::text[],\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "doctor_availability",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.doctor_availability (\n    id uuid NOT NULL DEFAULT uuid_generate_v4(),\n    doctor_id uuid NOT NULL,\n    day_of_week text NOT NULL,\n    slot_time text[] NOT NULL,\n    status text DEFAULT 'available'::text,\n    created_at timestamp with time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "doctor_services",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.doctor_services (\n    id uuid NOT NULL DEFAULT uuid_generate_v4(),\n    doctor_id uuid NOT NULL,\n    service_name text NOT NULL,\n    price numeric(10,2) NOT NULL DEFAULT 0,\n    duration_minutes integer NOT NULL DEFAULT 30,\n    created_at timestamp with time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "doctors",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.doctors (\n    id uuid NOT NULL,\n    health_center_id uuid,\n    name text NOT NULL,\n    email text NOT NULL,\n    specialization text NOT NULL,\n    contact text,\n    approved boolean DEFAULT false,\n    created_at timestamp with time zone DEFAULT now(),\n    document_proof text,\n    profile text,\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "health_center_availability",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.health_center_availability (\n    id uuid NOT NULL DEFAULT uuid_generate_v4(),\n    health_center_id uuid,\n    day_of_week text NOT NULL,\n    slot_time text[] NOT NULL,\n    status text DEFAULT 'available'::text,\n    created_at timestamp with time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "health_center_services",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.health_center_services (\n    id uuid NOT NULL DEFAULT uuid_generate_v4(),\n    health_center_id uuid,\n    service_name text NOT NULL,\n    price numeric,\n    status text DEFAULT 'active'::text,\n    created_at timestamp with time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "health_centers",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.health_centers (\n    id uuid NOT NULL DEFAULT gen_random_uuid(),\n    user_id uuid NOT NULL,\n    hcrn_hfc text NOT NULL,\n    name text NOT NULL,\n    address text,\n    phone text,\n    pincode bigint,\n    approved boolean DEFAULT false,\n    created_at timestamp with time zone DEFAULT now(),\n    document_proof text,\n    email text,\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "liveconsult",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.liveconsult (\n    id bigint NOT NULL DEFAULT nextval('liveconsult_id_seq'::regclass),\n    full_name text NOT NULL,\n    dob date NOT NULL,\n    phone numeric NOT NULL,\n    gender text NOT NULL,\n    email text NOT NULL,\n    consultation_date date NOT NULL,\n    consultation_time text NOT NULL,\n    speciality text NOT NULL,\n    created_at timestamp without time zone DEFAULT now(),\n    user_id uuid NOT NULL,\n    doctor_id uuid NOT NULL,\n    prescriptions text[],\n    reports text[],\n    status text NOT NULL DEFAULT 'pending'::text,\n    meet_url text,\n    bills text[],\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "payment_appointments",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.payment_appointments (\n    id bigint NOT NULL DEFAULT nextval('payment_appointments_id_seq'::regclass),\n    appointment_id uuid NOT NULL,\n    order_id text NOT NULL,\n    payment_session_id text,\n    status text NOT NULL DEFAULT 'pending'::text,\n    amount numeric NOT NULL,\n    response jsonb,\n    created_at timestamp without time zone DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "payment_liveconsult",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.payment_liveconsult (\n    id bigint NOT NULL DEFAULT nextval('payment_liveconsult_id_seq'::regclass),\n    doctor_id uuid NOT NULL,\n    order_id text,\n    status text NOT NULL DEFAULT 'pending'::text,\n    payment_method text,\n    amount numeric,\n    created_at timestamp without time zone NOT NULL DEFAULT now(),\n    PRIMARY KEY (id)\n);"
  },
  {
    "table_name": "profiles",
    "create_table_sql": "CREATE TABLE IF NOT EXISTS public.profiles (\n    id uuid NOT NULL,\n    role text,\n    first_name text,\n    last_name text,\n    username text,\n    health_center_name text,\n    pincode text,\n    official_email text,\n    contact_number text,\n    address text,\n    metadata jsonb,\n    created_at timestamp without time zone DEFAULT now(),\n    hcrn_hfc text,\n    PRIMARY KEY (id)\n);"
  }
]