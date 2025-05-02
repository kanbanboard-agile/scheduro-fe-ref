"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="download" className="py-4 md:py-16 mb-20 pt-16">
      <div className="container mx-auto px-12 md:px-40">

        <h2 className="text-[#6387CE] text-xl md:text-3xl md:py-16 mb-3 md:mb-2 font-bold tracking-wider p-8 text-center">
          Available on Android Version
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#4F6EC1] to-[#6387CE] rounded-2xl p-8 md:p-24 text-center text-white relative overflow-hidden"
        >
          {/* Background Grid For Desktop */}
          <div className="absolute inset-0 opacity-10 hidden md:block">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Background Grid For Mobile */}
          <div className="absolute inset-0 opacity-10 md:hidden">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <defs>
                <pattern id="gridMobile" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridMobile)" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-xl md:text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
            <p className="text-blue-50 text-sm md:text-lg mx-auto mb-8 md:text-center">
              Take control of your time, focus on priorities. Start your task management journey with Scheduro today!
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.scheduro.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-blue-100 text-[#3D4C90] text-sm md:text-base hover:bg-gray-200 py-6 px-6 rounded-full shadow-border cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110">
                Download Now
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;