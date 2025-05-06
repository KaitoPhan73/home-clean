"use client";
import authClient from "@/apis/clients/auth";
import { setUser } from "@/redux/User/userSlice";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import animationData from "@/components/loading.json";
import Lottie from "lottie-react";

function LogoutLogic() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state update if component unmounted

    const logout = async () => {
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.clear();
        dispatch(setUser(null));

        await authClient.logoutFromNextClientToNextServer(true);

        if (isMounted) {
          router.push(`/?redirectFrom=${pathname}`);
        }
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        if (isMounted) {
          router.refresh();
        }
      }
    };

    logout();

    return () => {
      // Cleanup: Mark component as unmounted
      isMounted = false;
    };
  }, [router, pathname, dispatch]);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Lottie
        animationData={animationData}
        className="flex justify-center items-center w-1/2 h-1/2"
        loop={true}
      />
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoutLogic />
    </Suspense>
  );
}
