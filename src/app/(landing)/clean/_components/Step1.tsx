"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Step1() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="px-4"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Step 1: Schedule Pickup</CardTitle>
          <CardDescription>Book a pickup time that works for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Our team will arrive at your doorstep to collect your laundry at the scheduled time.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}