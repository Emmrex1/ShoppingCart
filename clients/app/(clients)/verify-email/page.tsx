"use client";

import VerifyEmailContent from "@/components/VerifyingEmail";
import { Suspense } from "react";


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
