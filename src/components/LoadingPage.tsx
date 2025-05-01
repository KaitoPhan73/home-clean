// components/loading-screen.tsx
import Lottie from "lottie-react";
import loadingAnimation from "@/components/login-loading.json";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="w-48 h-48">
        <Lottie animationData={loadingAnimation} loop={true} />
      </div>
    </div>
  );
}