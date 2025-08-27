"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { verifyEmail } from "@/service/authService";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        await verifyEmail(token); 
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err) {
        setStatus("error");
        toast.error("Invalid or expired verification link.");
      }
    };

    verify();
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
