"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await axios.post("/api/auth/verify-email", { token });
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch {
        setStatus("error");
        toast.error("Invalid or expired verification link.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-md">
        {status === "loading" && <p>Verifying your email...</p>}
        {status === "success" && (
          <p className="text-green-600 font-semibold">
            ✅ Email verified successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 font-semibold">
            ❌ Verification failed. Please request a new link.
          </p>
        )}
      </div>
    </div>
  );
}