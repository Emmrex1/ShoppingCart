import OAuthCallbackClient from "@/components/OAuthCallbackClient";
import { Suspense } from "react";


export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthCallbackClient />
    </Suspense>
  );
}
