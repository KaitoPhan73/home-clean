"use client";

import { useEffect, useRef } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import "../homeplus/_components/intro-custom.css";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { ChatMessageListDemo } from "@/app/(landing)/homeplus/demo";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const introRef = useRef<ReturnType<typeof introJs> | null>(null);

  useEffect(() => {
    if (!introRef.current) {
      introRef.current = introJs();
      introRef.current.setOptions({
        steps: [
          { element: "#home", intro: "💡 Đây là trang chủ HomePlus." },
          {
            element: "#header",
            intro: "🚀 Đây là thanh header chứa logo và menu chính.",
          },
          {
            element: "#avatar",
            intro:
              "👤 Đây là avatar người dùng. Nhấn vào để xem thông tin cá nhân.",
          },
          {
            element: "#dark-mode",
            intro: "🌙 Đây là nút chuyển đổi Dark Mode.",
          },
          {
            element: "#chat-box",
            intro: "💬 Đây là chat box để bạn trò chuyện với hỗ trợ viên.",
          },
        ],
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: false,
        tooltipClass: "introjs-custom", // Áp dụng CSS custom
        nextLabel: "Tiếp ▶",
        prevLabel: "◀ Trước",
        doneLabel: "Hoàn tất ✅",
        hidePrev: true,
      });
    }

    introRef.current?.start();
  }, []);

  return (
    <>
      <Header />
      <main className="pt-16" id="home">
        {children}
      </main>
      <div className="bottom-50">
        <ChatMessageListDemo />
      </div>
      <Footer />
    </>
  );
}
