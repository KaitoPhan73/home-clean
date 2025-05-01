"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import loadingAnimation from "@/components/login-loading.json";

export default function LoadingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/homeplus";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectUrl);
    }, 2000); // 2-second delay to show the animation

    return () => clearTimeout(timer);
  }, [router, redirectUrl]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-32 h-32">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
}