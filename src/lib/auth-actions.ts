"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

// ---------------- LOGIN ----------------
export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient(); // Await async client

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message); // Throw error instead of redirect
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// ---------------- SIGNUP ----------------
export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient(); // Await async client

  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
      },
    },
  });

  if (error) {
    throw new Error(error.message); // Throw error instead of redirect
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// ---------------- SIGNOUT ----------------
export async function signout(): Promise<void> {
  const supabase = await createClient(); // Await async client

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message); // Throw error instead of redirect
  }

  revalidatePath("/", "layout");
  redirect("/login"); // Redirect to login instead of /logout
}
