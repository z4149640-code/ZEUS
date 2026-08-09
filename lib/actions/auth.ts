"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const validUser = process.env.ADMIN_USERNAME;
  const validPwd = process.env.ADMIN_PASSWORD;

  if (username === validUser && password === validPwd) {
    cookies().set("zeus_admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/admin");
  }

  return { error: "بيانات الدخول غير صحيحة" };
}

export async function logoutAction() {
  cookies().delete("zeus_admin_session");
  redirect("/admin/login");
}
