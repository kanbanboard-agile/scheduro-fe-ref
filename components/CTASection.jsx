"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section
      id="download"
      className="py-4 md:py-16 mb-20 pt-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[#6387CE] text-xl md:text-3xl font-bold tracking-wider text-center mb-6 md:mb-8">
          Available on Android Version
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-[#4F6EC1] to-[#6387CE] rounded-2xl p-6 md:p-12 text-center text-white overflow-hidden"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                  className="md:[&>path]:scale-50"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-xl md:text-3xl font-bold mb-4">
              Ready to Boost Your Productivity?
            </h3>
            <p className="text-blue-50 text-sm md:text-lg max-w-2xl mx-auto mb-8">
              Take control of your time, focus on priorities. Start your task
              management journey with Scheduro today!
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.scheduro.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Scheduro from Google Play Store"
            >
              <Button
                className="bg-blue-100 text-[#3D4C90] text-sm md:text-base hover:bg-gray-200 py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-110"
              >
                Download Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}