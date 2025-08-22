"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuth) {
      router.replace("/login");
    }
  }, [isAuth, loading, router]);

  if (loading || !isAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}