"use client";
import React from "react";
import LoginPage from "@/components/auth/login";
import AuthWrapper from "@/components/auth/AuthWrapper";

function Page() {
  return (
    <AuthWrapper authRoute={true}>
      <LoginPage />
    </AuthWrapper>
  )
}

export default Page;
