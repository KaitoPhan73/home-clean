"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Step3() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="px-4"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Step 3: Delivery</CardTitle>
          <CardDescription>Fresh and clean clothes delivered to your door.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Your laundry is returned to you on time, neatly packed and ready to use.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}