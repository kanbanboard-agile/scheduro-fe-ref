'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  // Optimized scroll handler with debouncing
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowButton(window.scrollY > 300);
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Back to Top Button - From previous version */}
      <AnimatePresence>
        {showButton && (
          <motion.div className="fixed bottom-6 right-6 z-50" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
            <button onClick={scrollToTop} className="bg-gradient-to-br from-[#6387CE] to-[#4058A4] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1" aria-label="Back to top">
              <ChevronUp className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wave SVG */}
      <div className="w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#AAC3E6"
            fillOpacity="1"
            d="M0,64L40,53.3C80,43,160,21,240,26.7C320,32,400,64,480,112C560,160,640,224,720,224C800,224,880,160,960,149.3C1040,139,1120,181,1200,186.7C1280,192,1360,160,1400,144L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-[#AAC3E6] pt-6 pb-6 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-800">© Copyright {new Date().getFullYear()} Scheduro. All Rights Reserved</p>
          <p className="text-sm text-gray-800">
            📩 <a href="mailto:support@scheduro.com">support@scheduro.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
