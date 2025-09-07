"use client";

import { Suspense } from "react";
import VerifyOtpForm from "@/components/forms/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
