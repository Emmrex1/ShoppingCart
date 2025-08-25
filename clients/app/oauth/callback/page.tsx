"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FaSpinner } from "react-icons/fa";

type DecodedUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
};

export default function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      setStep(2);
      localStorage.setItem("token", token);

      try {
        const user: DecodedUser = jwtDecode(token);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to decode token:", e);
      }

      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => {
        setStep(3);
        router.replace("/");
      }, 1500);
    } else if (error) {
      console.error("OAuth Error:", error);
      setErrorMessage("Authentication failed. Please try again.");
      setTimeout(() => router.replace("/login"), 2000);
    }
  }, [router, searchParams]);

  const steps = ["Personal Info", "Account Info", "Verify Email"];

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          {steps.map((label, index) => (
            <span
              key={label}
              className={`flex-1 text-center ${
                step === index + 1 ? "text-blue-600" : ""
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all duration-700"
            style={{ width: `${(step / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Status Display */}
      <div className="flex flex-col items-center text-center">
        {!errorMessage ? (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-3xl mb-4" />
            <p className="text-gray-700 text-lg">
              {step === 1 && "Collecting your details..."}
              {step === 2 && "Processing your login..."}
              {step === 3 && "Redirecting you to the main page..."}
            </p>
          </>
        ) : (
          <p className="text-red-500 text-lg font-medium">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
