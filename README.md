# 🏥 Mediconnect

Mediconnection is a healthcare workflow platform built with **Next.js**, **Supabase**, and **Cloudinary**.  
It streamlines health center registration, admin approval, doctor management, and patient consultations with secure role-based access.

This project was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and uses **Next.js** for frontend and API routes.

---

## 🚀 Features

- Health center onboarding & admin approval workflow  
- Secure role-based authentication (Super Admin, Health Center, Doctor, User)  
- Real-time dashboards powered by Supabase  
- Doctor management and consultation scheduling  
- Document & report uploads with Cloudinary  
- Responsive UI built with Next.js and TailwindCSS  

---

## 🛠️ Tech Stack

- **Next.js (JavaScript)** – Frontend & API Routes  
- **Supabase** – Authentication, Database, RLS Policies  
- **Cloudinary** – Media & Document Storage  
- **Tailwind CSS** – Modern UI Styling  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Divine-P-77777/Mediconnection_Project_2.git .

```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install

```

### 3️⃣ Configure Environment Variables

Create a .env.local file in the frontend directory:
``` bash
NEXT_PUBLIC_SUPABASE_URL=https://************.supabase.co


NEXT_PUBLIC_SUPABASE_ANON_KEY=*****
NEXT_PUBLIC_ZEGO_APP_ID=****************
NEXT_PUBLIC_ZEGO_SERVER_SECRET=**************
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=***************
NEXT_PUBLIC_CLOUDINARY_PRESET=**************
NEXT_PUBLIC_SUPER_ADMINS=***********
NEXT_PUBLIC_API_URL=http://localhost:3000



``` 


For backend/admin usage, create a .env file:

``` bash
SUPABASE_SERVICE_ROLE_KEY=**********


CLOUDINARY_API_KEY=**********
CLOUDINARY_API_SECRET=**********

SUPABASE_URL=https://**********.supabase.co

CASHFREE_CLIENT_ID=**********
CASHFREE_CLIENT_SECRET=**********

NEXT_PUBLIC_APP_URL=http://localhost:3000



```

Important: Never commit your .env or .env.local files. Keep keys private.


# Backend Setup (Supabase)

The database schema and all required tables are provided in the SQL folder at the root of the repository.
To set up your backend:

1. Log in to Supabase
 and create a new project.

2. Open the SQL editor in Supabase and run the .sql files from the SQL folder.

3. Configure RLS policies and roles as per your project requirements.

4. Add your Supabase URL and keys to the .env.local and .env files as shown above.



## Authentication & Roles

Super Admin – Approves health centers

Health Center – Manages doctors & patients

Doctor – Handles consultations

User/Patient – Books appointments, downloads reports

🌐 Live Demo

👉 Visit Mediconnection.vercel.app



📜 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute it with proper attribution.

####

###