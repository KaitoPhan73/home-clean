"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LaundryPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-blue-900 mb-4"
        >
          HomePlus Laundry Service
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl text-gray-600"
        >
          Smart, Fast, and Reliable Laundry Solutions for Apartment Residents
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8"
        >
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
        </motion.div>
      </div>

      {/* Steps Section */}
      <div className="space-y-20 py-20">
        {/* Step 1: Schedule Pickup */}
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
              <div className="mt-4">
                <Label htmlFor="pickup-time">Pickup Time</Label>
                <Input id="pickup-time" type="datetime-local" className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 2: Laundry Process */}
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
              <div className="mt-4">
                <Label htmlFor="laundry-type">Laundry Type</Label>
                <select id="laundry-type" className="mt-2 block w-full p-2 border rounded">
                  <option>Normal Wash</option>
                  <option>Dry Cleaning</option>
                  <option>Ironing Only</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 3: Delivery */}
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
              <div className="mt-4">
                <Label htmlFor="delivery-address">Delivery Address</Label>
                <Input id="delivery-address" type="text" className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-900 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Ready to Simplify Your Laundry?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 mb-8"
          >
            Join thousands of apartment residents who trust HomePlus for their laundry needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button className="bg-white text-blue-900 hover:bg-gray-100">Sign Up Now</Button>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg">© 2023 HomePlus. All rights reserved.</p>
          <Separator className="my-4 bg-gray-700" />
          <p className="text-sm text-gray-400">
            Designed with ❤️ for apartment residents in Ho Chi Minh City.
          </p>
        </div>
      </footer>
    </div>
  );
}