"use client";
import React, { useState, useEffect } from "react";
import LoginPage from "@/components/auth/login";
import Loader from "@/components/ui/loader";

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ Simulate loading (e.g., fetching user/auth state)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1.5 sec loader, adjust as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // ✅ Show same loader here
    return (
      <Loader />
    );
  }

  return <LoginPage />;
}

export default Page;
