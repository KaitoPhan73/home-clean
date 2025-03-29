/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Sparkles, Star, ThumbsUp, Users } from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Reusable animated section component
const AnimatedSection: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true});
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.section
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function HomeCleaningLanding() {
  // Process steps data
  const cleaningSteps = [
    {
      title: "Đặt lịch dễ dàng",
      description: "Chỉ cần vài thao tác đơn giản trên ứng dụng HomePlus để đặt lịch dọn dẹp nhà cửa.",
      icon: <Clock className="w-10 h-10 text-primary" />
    },
    {
      title: "Nhân viên chuyên nghiệp",
      description: "Đội ngũ nhân viên được đào tạo bài bản, có kinh nghiệm và được đánh giá cao.",
      icon: <Users className="w-10 h-10 text-primary" />
    },
    {
      title: "Làm sạch toàn diện",
      description: "Dịch vụ dọn dẹp chuyên sâu với các gói tùy chỉnh phù hợp cho từng loại căn hộ.",
      icon: <Sparkles className="w-10 h-10 text-primary" />
    },
    {
      title: "Đánh giá & Phản hồi",
      description: "Cung cấp đánh giá và phản hồi sau khi dịch vụ hoàn thành để cải thiện chất lượng.",
      icon: <Star className="w-10 h-10 text-primary" />
    }
  ];

  const benefits = [
    {
      title: "Tiết kiệm thời gian",
      description: "Không cần phải lo lắng về việc dọn dẹp, có thêm thời gian cho bản thân và gia đình."
    },
    {
      title: "Giá cả phải chăng",
      description: "Với ví chung của tòa nhà, chi phí dịch vụ được tối ưu hóa cho cư dân căn hộ."
    },
    {
      title: "Đáp ứng nhanh chóng",
      description: "Thời gian phản hồi nhanh với đội ngũ nhân viên luôn sẵn sàng phục vụ."
    }
  ];

  const packages = [
    {
      title: "Gói Cơ Bản",
      price: "199.000đ",
      features: ["Quét dọn sàn nhà", "Lau chùi bề mặt", "Dọn dẹp phòng khách", "Vệ sinh phòng tắm"],
      type: "Căn hộ Studio"
    },
    {
      title: "Gói Tiêu Chuẩn",
      price: "299.000đ",
      features: ["Tất cả dịch vụ Gói Cơ Bản", "Vệ sinh tủ bếp", "Lau cửa kính", "Giặt rèm"],
      type: "Căn hộ 1-2 phòng ngủ"
    },
    {
      title: "Gói Cao Cấp",
      price: "399.000đ",
      features: ["Tất cả dịch vụ Gói Tiêu Chuẩn", "Vệ sinh sâu thiết bị", "Khử trùng toàn bộ", "Đánh bóng sàn"],
      type: "Căn hộ 2-3 phòng ngủ"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Main content container with explicit height and overflow settings */}
      <div className="h-screen overflow-y-scroll">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-indigo-600/80" />
            <img 
              src="/api/placeholder/1920/1080" 
              alt="Căn hộ sạch sẽ" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-5 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Dịch Vụ Dọn Dẹp Nhà Cửa
                <span className="text-blue-200 block mt-2">Chuyên Biệt Cho Căn Hộ</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Giải pháp dọn dẹp toàn diện dành riêng cho cư dân căn hộ tại TP. Hồ Chí Minh
              </p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-full text-lg px-8 py-6">
                Đặt Lịch Ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
          
          {/* Arrow indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white mb-2">Cuộn xuống để khám phá</p>
            <div className="animate-bounce">
              <ArrowRight className="h-10 w-10 text-white rotate-90" />
            </div>
          </div>
        </section>

        {/* Rest of the sections remain the same */}
        {/* Introduction */}
        <AnimatedSection className="py-20 container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              HomePlus - Cổng Dịch Vụ Sống Thông Minh
            </h2>
            <p className="text-xl text-gray-600">
              Ứng dụng chuyên biệt dành cho cư dân căn hộ, mang đến những trải nghiệm dọn dẹp nhà cửa 
              tiện lợi, nhanh chóng và tiết kiệm chi phí.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div variants={fadeIn} key={index}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <ThumbsUp className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Process Steps */}
        <AnimatedSection className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <motion.div variants={fadeIn} className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Quy Trình Dọn Dẹp Chuyên Nghiệp
              </h2>
              <p className="text-xl text-gray-600">
                Trải nghiệm dịch vụ dọn dẹp nhà cửa thông minh chỉ với vài bước đơn giản
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cleaningSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="relative"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-t-4 border-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-4">
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-center">{step.title}</h3>
                      <p className="text-gray-600 text-center">{step.description}</p>
                    </CardContent>
                  </Card>
                  
                  {index < cleaningSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-blue-500" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Service Packages */}
        <AnimatedSection className="py-20 container mx-auto px-4">
          <motion.div variants={fadeIn} className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Gói Dịch Vụ Dọn Dẹp
            </h2>
            <p className="text-xl text-gray-600">
              Lựa chọn gói dịch vụ phù hợp với nhu cầu và loại căn hộ của bạn
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div variants={fadeIn} key={index}>
                <Card className="h-full hover:shadow-lg transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                    {pkg.type}
                  </div>
                  <CardContent className="pt-10">
                    <h3 className="text-2xl font-semibold mb-2 text-center">{pkg.title}</h3>
                    <p className="text-3xl font-bold text-center text-blue-600 mb-6">{pkg.price}</p>
                    <ul className="space-y-2 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <ArrowRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-center">
                      <Button className="rounded-full px-8">Chọn Gói</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Remaining sections... (footer, etc.) */}
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">HomePlus</h3>
              <p className="mb-6">Cổng dịch vụ sống thông minh cho cư dân</p>
              <p className="text-gray-400">© 2025 HomePlus. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}