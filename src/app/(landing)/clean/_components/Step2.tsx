"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Step2() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="px-4"
    >
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Step 2: Laundry Process</CardTitle>
          <CardDescription>We handle your clothes with care.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Your laundry is cleaned, dried, and folded using eco-friendly detergents and state-of-the-art machines.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}