/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import { MdOutlineMail } from "react-icons/md";
import { Button } from "@/components/ui/button"; // Giả sử bạn có Button từ ShadCN
import { Copy } from "lucide-react"; // Icon Copy từ lucide-react

const Footer = () => {
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [randomCode, setRandomCode] = useState("");

  // Hàm tạo mã ngẫu nhiên 6 ký tự
  const generateRandomCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  // Hàm bắt đầu đếm ngược
  const startCountdown = () => {
    const randomSeconds = Math.floor(Math.random() * 11) + 50; // Random 50-60s
    setCountdown(randomSeconds);
    setIsCountdownActive(true);
  };

  // Effect để chạy đếm ngược
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isCountdownActive) {
      setIsCountdownActive(false);
      setRandomCode(generateRandomCode()); // Tạo mã khi đếm ngược xong
    }
    return () => clearInterval(timer); // Dọn dẹp timer
  }, [isCountdownActive, countdown]);

  // Hàm copy mã vào clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(randomCode);
    alert("Đã sao chép mã: " + randomCode); // Thông báo đơn giản, có thể thay bằng toast
  };

  return (
    <footer className="bg-neutral-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between gap-2 items-start border-t border-black py-8 px-12 bg-gray-100 dark:bg-gray-800">
        <div className="text-center md:text-left md:w-2/5">
          <div className="flex items-center">
            <Icon className="h-180 w-80 dark:filter dark:invert" />
            <div className="text-lg max-w-xl ml-4">
              <h2 className="text-2xl font-semibold mb-4">
                Trải nghiệm tuyệt vời với KALBAN
              </h2>
              <p>
                Khám phá vẻ đẹp của các sản phẩm túi xanh và những thiết kế độc
                đáo. Chúng tôi cung cấp thông tin chi tiết và hướng dẫn lựa chọn
                các túi phù hợp nhất cho nhu cầu của bạn.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:w-1/5">
          <h3 className="text-2xl font-semibold mb-4">Thương hiệu KALBAN</h3>
          <ul>
            <li className="flex gap-2 items-center mb-2">
              <FaPhoneAlt className="h-6 w-6 text-green-400" />
              <p className="text-gray-600 dark:text-white">0976-325-953</p>
            </li>
            <li className="flex gap-2 items-center mb-2">
              <GrMapLocation className="h-8 w-8 text-green-400" />
              <p className="text-gray-600 dark:text-white">
                FPT University HCMC, Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ,
                Thành Phố Thủ Đức, Hồ Chí Minh 700000
              </p>
            </li>
            <li className="flex gap-2 items-center mb-2">
              <MdOutlineMail className="h-6 w-6 text-green-400" />
              <p className="text-gray-600 dark:text-white">
                longdhpse171112@fpt.edu.vn
              </p>
            </li>
          </ul>
        </div>
        <div className="mt-8 md:mt-0 md:w-1/5">
          <h3 className="text-2xl font-semibold mb-4">Chính sách đổi trả</h3>
          <ul className="text-gray-600 dark:text-white">
            <li className="mb-2">Đổi trả trong vòng 30 ngày</li>
            <li className="mb-2">Sản phẩm còn nguyên vẹn</li>
            <li className="mb-2">Hỗ trợ đổi hàng tại cửa hàng</li>
            <li>Liên hệ để biết thêm chi tiết</li>
          </ul>
        </div>
        <div className="mt-8 md:mt-0 md:w-1/5">
          <h3 className="text-2xl font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=100086570243903"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-500"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/kalban.624/?fbclid=IwY2xjawFx2qFleHRuA2FlbQIxMAABHbTokm91AZa7HpbkaMYpn52MFw5wdRxgmHdBVAXnBjZp8U_KKobcOJ21RQ_aem_dCDc4G3ARtkxdm7EWD3wVw"
              className="text-pink-700 hover:text-pink-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          </div>
          {/* Ô chữ nhật mã khuyến mãi */}
          <div className="mt-6">
            <div className="border border-gray-300 rounded-lg p-4 bg-white dark:bg-gray-700 flex justify-center items-center min-h-[60px]">
              {!isCountdownActive && !randomCode ? (
                <Button
                  size="sm"
                  className="w-full bg-blue-500 text-white border border-blue-600 rounded-lg py-2 px-4 hover:bg-blue-600 transition"
                  onClick={startCountdown}
                >
                  Lấy Mã Ngay
                </Button>
              ) : isCountdownActive ? (
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {countdown}s
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    onClick={handleCopyCode}
                  >
                    <Copy size={16} />
                  </Button>
                  <span className="text-lg font-mono text-green-600 dark:text-green-400">
                    {randomCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center border-t border-black py-8">
        <p>
          © 2024 Khám Phá Các Mẫu Túi Có Sẵn Và Tự Lên Ý Tưởng. Sáng Tạo Nào!
        </p>
      </div>
    </footer>
  );
};

function Icon(props: any) {
  return (
    <div className="flex items-center">
      <Image
        priority
        src="/svgs/kalban-logo.svg"
        height={32}
        width={32}
        alt="Kalban-logo"
        {...props}
      />
    </div>
  );
}

export default Footer;
