'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMobile';

const HeroSection = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Function to scroll to the About section
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-gray-50 min-h-[90vh] flex flex-col md:flex-row justify-between items-center px-16 sm:px-10 md:px-20 py-16 overflow-hidden md:ml-6">
      <motion.img
        src="https://res.cloudinary.com/dwgwb5vro/image/upload/v1741287250/char_1_1_ugxw4a.png"
        alt="Character with productivity icons"
        className="w-72 md:w-96 lg:w-[450px] drop-shadow-2xl md:hidden block mb-8 -mt-2"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{
          y: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
      />
      <motion.div className="w-full md:w-1/2 text-center md:text-left" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <motion.div className="relative inline-block py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <motion.h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight tracking-tight">
            <span className="relative z-10">Seamless </span>

            <motion.span className="text-[#6387CE] relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
              Scheduling
            </motion.span>
            <br />
            <span className="relative z-10">Ultimate </span>

            <motion.span className="text-[#6387CE] relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              Productivity
            </motion.span>
          </motion.h1>
          <motion.div className="absolute -bottom-4 -left-6 w-20 h-20 bg-[#6387CE]/10 rounded-full blur-xl z-0" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, duration: 1 }} />
          <motion.div className="absolute top-1/4 -right-10 w-32 h-32 bg-[#6387CE]/10 rounded-full blur-xl z-0" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, duration: 1 }} />
        </motion.div>

        <motion.p className="md:text-lg text-gray-700 mt-8 md:mt-8 mx-auto md:mx-0 md:max-w-lg text-center md:text-justify text-l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
          Scheduro helps you manage your tasks and time effectively, giving you the control to focus on what truly matters.
        </motion.p>

        {isDesktop ? (
          <motion.a
            href="/register"
            className="bg-[#6387CE] text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md hover:bg-[#4058A4] mt-8 md:mt-12 mx-auto md:mx-0 transition-all duration-300 cursor-pointer ease-in-out transform hover:scale-105 w-[180px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px -5px rgba(99, 135, 206, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium whitespace-nowrap">Try it on Web!</span>
          </motion.a>
        ) : (
          // Mobile
          <motion.a href="https://play.google.com/store/apps/details?id=com.scheduro.app" target="_blank" rel="noopener noreferrer">
            <img
              src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745657571/play_store_syrqco.png"
              alt="Get it on Google Play"
              className="h-auto w-50 -mt-4 mx-auto -mb-24 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
            />
          </motion.a>
        )}
      </motion.div>

      <motion.div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0 relative" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
        <motion.div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6387CE]/10 rounded-full blur-3xl z-0" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 1 }} />
        <motion.div className="relative z-10 md:ml-32" whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}>
          <motion.img
            src="https://res.cloudinary.com/dwgwb5vro/image/upload/v1741287250/char_1_1_ugxw4a.png"
            alt="Character with productivity icons"
            className="w-72 md:w-96 lg:w-[450px] drop-shadow-2xl md:block hidden"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{
              y: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut',
              },
            }}
          />
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] h-8 bg-black/10 blur-md rounded-full z-0"
            initial={{ scaleX: 0.8, opacity: 0.5 }}
            animate={{
              scaleX: [0.8, 0.9, 0.8],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
