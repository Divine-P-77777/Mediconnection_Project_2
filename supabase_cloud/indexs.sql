[
  {
    "indexname": "account_details_doctors_doctor_id_key",
    "tablename": "account_details_doctors",
    "indexdef": "CREATE UNIQUE INDEX account_details_doctors_doctor_id_key ON public.account_details_doctors USING btree (doctor_id)"
  },
  {
    "indexname": "account_details_doctors_pkey",
    "tablename": "account_details_doctors",
    "indexdef": "CREATE UNIQUE INDEX account_details_doctors_pkey ON public.account_details_doctors USING btree (id)"
  },
  {
    "indexname": "account_details_healthcenter_pkey",
    "tablename": "account_details_healthcenter",
    "indexdef": "CREATE UNIQUE INDEX account_details_healthcenter_pkey ON public.account_details_healthcenter USING btree (id)"
  },
  {
    "indexname": "appointments_pkey",
    "tablename": "appointments",
    "indexdef": "CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id)"
  },
  {
    "indexname": "doctor_availability_pkey",
    "tablename": "doctor_availability",
    "indexdef": "CREATE UNIQUE INDEX doctor_availability_pkey ON public.doctor_availability USING btree (id)"
  },
  {
    "indexname": "doctor_services_pkey",
    "tablename": "doctor_services",
    "indexdef": "CREATE UNIQUE INDEX doctor_services_pkey ON public.doctor_services USING btree (id)"
  },
  {
    "indexname": "doctors_email_key",
    "tablename": "doctors",
    "indexdef": "CREATE UNIQUE INDEX doctors_email_key ON public.doctors USING btree (email)"
  },
  {
    "indexname": "doctors_pkey",
    "tablename": "doctors",
    "indexdef": "CREATE UNIQUE INDEX doctors_pkey ON public.doctors USING btree (id)"
  },
  {
    "indexname": "health_center_availability_pkey",
    "tablename": "health_center_availability",
    "indexdef": "CREATE UNIQUE INDEX health_center_availability_pkey ON public.health_center_availability USING btree (id)"
  },
  {
    "indexname": "health_center_services_pkey",
    "tablename": "health_center_services",
    "indexdef": "CREATE UNIQUE INDEX health_center_services_pkey ON public.health_center_services USING btree (id)"
  },
  {
    "indexname": "health_centers_pkey",
    "tablename": "health_centers",
    "indexdef": "CREATE UNIQUE INDEX health_centers_pkey ON public.health_centers USING btree (id)"
  },
  {
    "indexname": "unique_health_center_user",
    "tablename": "health_centers",
    "indexdef": "CREATE UNIQUE INDEX unique_health_center_user ON public.health_centers USING btree (user_id)"
  },
  {
    "indexname": "liveconsult_pkey",
    "tablename": "liveconsult",
    "indexdef": "CREATE UNIQUE INDEX liveconsult_pkey ON public.liveconsult USING btree (id)"
  },
  {
    "indexname": "payment_appointments_pkey",
    "tablename": "payment_appointments",
    "indexdef": "CREATE UNIQUE INDEX payment_appointments_pkey ON public.payment_appointments USING btree (id)"
  },
  {
    "indexname": "payment_liveconsult_pkey",
    "tablename": "payment_liveconsult",
    "indexdef": "CREATE UNIQUE INDEX payment_liveconsult_pkey ON public.payment_liveconsult USING btree (id)"
  },
  {
    "indexname": "profiles_pkey",
    "tablename": "profiles",
    "indexdef": "CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)"
  },
  {
    "indexname": "profiles_username_key",
    "tablename": "profiles",
    "indexdef": "CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username)"
  }
]