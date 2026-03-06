| table_name                   | constraint_name                                    | constraint_type | column_name      |
| ---------------------------- | -------------------------------------------------- | --------------- | ---------------- |
| account_details_doctors      | account_details_doctors_doctor_fkey                | FOREIGN KEY     | doctor_id        |
| account_details_doctors      | account_details_doctors_pkey                       | PRIMARY KEY     | id               |
| account_details_doctors      | account_details_doctors_doctor_id_key              | UNIQUE          | doctor_id        |
| account_details_healthcenter | account_details_healthcenter_health_center_id_fkey | FOREIGN KEY     | health_center_id |
| account_details_healthcenter | account_details_healthcenter_pkey                  | PRIMARY KEY     | id               |
| appointments                 | appointments_user_id_fkey                          | FOREIGN KEY     | user_id          |
| appointments                 | appointments_pkey                                  | PRIMARY KEY     | id               |
| doctor_availability          | doctor_availability_doctor_fkey                    | FOREIGN KEY     | doctor_id        |
| doctor_availability          | doctor_availability_pkey                           | PRIMARY KEY     | id               |
| doctor_services              | doctor_services_doctor_fkey                        | FOREIGN KEY     | doctor_id        |
| doctor_services              | doctor_services_pkey                               | PRIMARY KEY     | id               |
| doctors                      | doctors_id_fkey                                    | FOREIGN KEY     | id               |
| doctors                      | doctors_pkey                                       | PRIMARY KEY     | id               |
| doctors                      | doctors_email_key                                  | UNIQUE          | email            |
| health_center_availability   | health_center_availability_hc_fkey                 | FOREIGN KEY     | health_center_id |
| health_center_availability   | health_center_availability_pkey                    | PRIMARY KEY     | id               |
| health_center_services       | health_center_services_hc_fkey                     | FOREIGN KEY     | health_center_id |
| health_center_services       | health_center_services_pkey                        | PRIMARY KEY     | id               |
| health_centers               | health_centers_user_id_fkey                        | FOREIGN KEY     | user_id          |
| health_centers               | health_centers_pkey                                | PRIMARY KEY     | id               |
| health_centers               | unique_health_center_user                          | UNIQUE          | user_id          |
| liveconsult                  | liveconsult_doctor_fkey                            | FOREIGN KEY     | doctor_id        |
| liveconsult                  | liveconsult_user_fkey                              | FOREIGN KEY     | user_id          |
| liveconsult                  | liveconsult_pkey                                   | PRIMARY KEY     | id               |
| payment_appointments         | payment_appointments_appointment_fkey              | FOREIGN KEY     | appointment_id   |
| payment_appointments         | payment_appointments_pkey                          | PRIMARY KEY     | id               |
| payment_liveconsult          | payment_liveconsult_doctor_fkey                    | FOREIGN KEY     | doctor_id        |
| payment_liveconsult          | payment_liveconsult_pkey                           | PRIMARY KEY     | id               |
| profiles                     | profiles_id_fkey                                   | FOREIGN KEY     | id               |
| profiles                     | profiles_pkey                                      | PRIMARY KEY     | id               |
| profiles                     | profiles_username_key                              | UNIQUE          | username         |





[
  {
    "from_table": "account_details_doctors",
    "from_column": "doctor_id",
    "to_table": "doctors",
    "to_column": "id",
    "constraint_name": "account_details_doctors_doctor_fkey"
  },
  {
    "from_table": "account_details_healthcenter",
    "from_column": "health_center_id",
    "to_table": "health_centers",
    "to_column": "id",
    "constraint_name": "account_details_healthcenter_health_center_id_fkey"
  },
  {
    "from_table": "doctor_availability",
    "from_column": "doctor_id",
    "to_table": "doctors",
    "to_column": "id",
    "constraint_name": "doctor_availability_doctor_fkey"
  },
  {
    "from_table": "doctor_services",
    "from_column": "doctor_id",
    "to_table": "doctors",
    "to_column": "id",
    "constraint_name": "doctor_services_doctor_fkey"
  },
  {
    "from_table": "health_center_availability",
    "from_column": "health_center_id",
    "to_table": "health_centers",
    "to_column": "id",
    "constraint_name": "health_center_availability_hc_fkey"
  },
  {
    "from_table": "health_center_services",
    "from_column": "health_center_id",
    "to_table": "health_centers",
    "to_column": "id",
    "constraint_name": "health_center_services_hc_fkey"
  },
  {
    "from_table": "liveconsult",
    "from_column": "doctor_id",
    "to_table": "doctors",
    "to_column": "id",
    "constraint_name": "liveconsult_doctor_fkey"
  },
  {
    "from_table": "payment_appointments",
    "from_column": "appointment_id",
    "to_table": "appointments",
    "to_column": "id",
    "constraint_name": "payment_appointments_appointment_fkey"
  },
  {
    "from_table": "payment_liveconsult",
    "from_column": "doctor_id",
    "to_table": "doctors",
    "to_column": "id",
    "constraint_name": "payment_liveconsult_doctor_fkey"
  }
]