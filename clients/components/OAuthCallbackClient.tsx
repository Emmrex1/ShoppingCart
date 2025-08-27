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

export default function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      
      localStorage.setItem("token", token);

      try {
        const user: DecodedUser = jwtDecode(token);
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to decode token:", e);
      }

      window.dispatchEvent(new Event("authChange"));

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } else if (error) {
      console.error("OAuth Error:", error);
      setErrorMessage("Authentication failed. Please try again.");
      setTimeout(() => router.replace("/login"), 2000);
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 px-4">
  
      <div className="flex flex-col items-center text-center">
        {!errorMessage ? (
          <>
            <FaSpinner className="animate-spin text-blue-500 text-3xl mb-4" /> 
          </>
        ) : (
          <p className="text-red-500 text-lg font-medium">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
