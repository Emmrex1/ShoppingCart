import "../globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Await cookies because TS thinks it’s a Promise
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/"); 
  }

  return (
    <main className="min-h-screen items-center justify-center bg-gray-50">
      {children}
    </main>
  );
}
