// components/BackToTopButton.jsx
"use client";
import { motion } from "framer-motion";
export function BackToTopButton() {
  return (
    <div className="text-center mb-4">
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-primary px-4 py-2 rounded-md text-sm text-white shadow-sm hover:bg-primary-hover hover:shadow-md transition-all duration-300"
        aria-label="Scroll back to top"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to top ↑
      </motion.button>
    </div>
  );
}

// components/WaveSVG.jsx
export function WaveSVG() {
  return (
    <div className="w-full overflow-hidden leading-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <path
          fill="#CCDAF1"
          fillOpacity="1"
          d="M0,64L40,53.3C80,43,160,21,240,26.7C320,32,400,64,480,112C560,160,640,224,720,224C800,224,880,160,960,149.3C1040,139,1120,181,1200,186.7C1280,192,1360,160,1400,144L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
      </svg>
    </div>
  );
}

// components/Footer.jsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative bg-gray-50">
      <BackToTopButton />
      <WaveSVG />
      <footer
        className="bg-[#CCDAF1] pt-6 pb-6"
        role="contentinfo"
        aria-label="Scheduro Footer"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-700">
            © Copyright {currentYear} Scheduro. All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
