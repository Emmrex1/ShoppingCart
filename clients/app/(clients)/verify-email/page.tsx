"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { saveAuthData } from "@/service/authService";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setStatus("error");
          return;
        }

        // ✅ Debug logs only in development
        if (process.env.NODE_ENV === "development") {
          console.log("🔍 API URL:", process.env.NEXT_PUBLIC_API_URL);
          console.log("🔍 Token:", token);
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
          { token }
        );

        if (res.data?.accessToken) {
          saveAuthData(res.data.accessToken, res.data.user);
          setStatus("success");

          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <p>Email verified successfully! Redirecting...</p>
      )}
      {status === "error" && (
        <p className="text-red-500">
          Email verification failed. Please try again.
        </p>
      )}
    </div>
  );
};

export default VerifyEmailPage;
