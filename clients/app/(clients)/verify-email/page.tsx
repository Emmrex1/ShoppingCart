"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { saveAuthData, verifyEmail, resendVerificationEmail } from "@/service/authService";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        setLoading(true);
        const res = await verifyEmail(token);

        if (res.token && res.user) {
          saveAuthData(res.token, res.user);
        }

        setSuccess(true);
        toast.success("Email verified successfully!");

        setTimeout(() => router.push("/login"), 3000);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Email verification failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, router]);

  const handleResend = async () => {
    const email = window.prompt("Enter your email to resend verification link:");
    if (!email) return;

    try {
      setResending(true);
      const res = await resendVerificationEmail(email);
      toast.success(res.message || "Verification email resent successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  if (!token) {
    return <p className="text-red-500 mt-10 text-center">Invalid verification link.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md text-center">
      {loading && <p>Verifying your email...</p>}
      {!loading && success && <p className="text-green-600 font-medium">Email verified successfully! Redirecting...</p>}
      {!loading && !success && (
        <>
          <p className="text-red-500">Verification failed. Please try again.</p>
          <Button
            onClick={handleResend}
            className="mt-4"
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend Verification Email"}
          </Button>
        </>
      )}
      <Button onClick={() => router.push("/login")} className="mt-4">
        Go to Login
      </Button>
    </div>
  );
}
