[
  {
    "table_schema": "public",
    "table_name": "account_details_doctors",
    "column_name": "id",
    "data_type": "bigint",
    "column_default": "nextval('account_details_doctors_id_seq'::regclass)",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_doctors",
    "column_name": "doctor_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_doctors",
    "column_name": "account_number",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_doctors",
    "column_name": "bank_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_doctors",
    "column_name": "ifsc_code",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_doctors",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_healthcenter",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "gen_random_uuid()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_healthcenter",
    "column_name": "health_center_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_healthcenter",
    "column_name": "account_number",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_healthcenter",
    "column_name": "ifsc_code",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_healthcenter",
    "column_name": "bank_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "account_details_healthcenter",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "gen_random_uuid()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "center_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "user_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "date",
    "data_type": "date",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "time",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "purpose",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "reports",
    "data_type": "ARRAY",
    "column_default": "'{}'::text[]",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "bills",
    "data_type": "ARRAY",
    "column_default": "'{}'::text[]",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'pending'::text",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "center_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "user_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "phone",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "gender",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "dob",
    "data_type": "date",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "appointments",
    "column_name": "prescriptions",
    "data_type": "ARRAY",
    "column_default": "'{}'::text[]",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_availability",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "uuid_generate_v4()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_availability",
    "column_name": "doctor_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_availability",
    "column_name": "day_of_week",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_availability",
    "column_name": "slot_time",
    "data_type": "ARRAY",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_availability",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'available'::text",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_availability",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_services",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "uuid_generate_v4()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_services",
    "column_name": "doctor_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_services",
    "column_name": "service_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_services",
    "column_name": "price",
    "data_type": "numeric",
    "column_default": "0",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_services",
    "column_name": "duration_minutes",
    "data_type": "integer",
    "column_default": "30",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctor_services",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "health_center_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "email",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "specialization",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "contact",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "approved",
    "data_type": "boolean",
    "column_default": "false",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "document_proof",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "doctors",
    "column_name": "profile",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_availability",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "uuid_generate_v4()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_availability",
    "column_name": "health_center_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_availability",
    "column_name": "day_of_week",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_availability",
    "column_name": "slot_time",
    "data_type": "ARRAY",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_availability",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'available'::text",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_availability",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_services",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "uuid_generate_v4()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_services",
    "column_name": "health_center_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_services",
    "column_name": "service_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_services",
    "column_name": "price",
    "data_type": "numeric",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_services",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'active'::text",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_center_services",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": "gen_random_uuid()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "user_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "hcrn_hfc",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "address",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "phone",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "pincode",
    "data_type": "bigint",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "approved",
    "data_type": "boolean",
    "column_default": "false",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "document_proof",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "health_centers",
    "column_name": "email",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "id",
    "data_type": "bigint",
    "column_default": "nextval('liveconsult_id_seq'::regclass)",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "full_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "dob",
    "data_type": "date",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "phone",
    "data_type": "numeric",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "gender",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "email",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "consultation_date",
    "data_type": "date",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "consultation_time",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "speciality",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "user_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "doctor_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "prescriptions",
    "data_type": "ARRAY",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "reports",
    "data_type": "ARRAY",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'pending'::text",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "meet_url",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "liveconsult",
    "column_name": "bills",
    "data_type": "ARRAY",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "id",
    "data_type": "bigint",
    "column_default": "nextval('payment_appointments_id_seq'::regclass)",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "appointment_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "order_id",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "payment_session_id",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'pending'::text",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "amount",
    "data_type": "numeric",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "response",
    "data_type": "jsonb",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_appointments",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "id",
    "data_type": "bigint",
    "column_default": "nextval('payment_liveconsult_id_seq'::regclass)",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "doctor_id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "order_id",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "status",
    "data_type": "text",
    "column_default": "'pending'::text",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "payment_method",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "amount",
    "data_type": "numeric",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "payment_liveconsult",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "column_default": "now()",
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "id",
    "data_type": "uuid",
    "column_default": null,
    "is_nullable": "NO",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "role",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "first_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "last_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "username",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "health_center_name",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "pincode",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "official_email",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "contact_number",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "address",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "metadata",
    "data_type": "jsonb",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "created_at",
    "data_type": "timestamp without time zone",
    "column_default": "now()",
    "is_nullable": "YES",
    "character_maximum_length": null
  },
  {
    "table_schema": "public",
    "table_name": "profiles",
    "column_name": "hcrn_hfc",
    "data_type": "text",
    "column_default": null,
    "is_nullable": "YES",
    "character_maximum_length": null
  }
]