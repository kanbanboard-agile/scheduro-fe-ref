"use client";
import Image from "next/image"; // Ganti img dengan next/image
import { motion } from "framer-motion";
import { Play, ArrowDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMobile";
import { useRouter } from "next/navigation"; // Untuk navigasi halus

// Variants untuk animasi reusable
const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const imageVariants = {
  float: {
    y: [20, 0],
    transition: {
      y: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  },
};

const HeroSection = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Fungsi navigasi ke section About dengan hash
  const scrollToAbout = () => {
    router.push("/#about", { scroll: true });
  };

  return (
    <section
      className="min-h-[90vh] flex flex-col md:flex-row justify-between items-center px-4 sm:px-10 md:px-20 py-16 overflow-hidden md:ml-6 bg-gray-50"
      aria-label="Hero Section" // Tambah ARIA untuk aksesibilitas
    >
      {/* Gambar untuk mobile */}
      {!isDesktop && (
        <motion.div
          variants={imageVariants}
          animate="float"
          className="w-72 drop-shadow-2xl mb-8 -mt-2"
        >
          <Image
            src="https://res.cloudinary.com/dwgwb5vro/image/upload/v1741287250/char_1_1_ugxw4a.png"
            alt="Character with productivity icons"
            width={288}
            height={288}
            priority // Prioritaskan pemuatan gambar di hero
            className="object-contain"
          />
        </motion.div>
      )}

      {/* Konten teks */}
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="relative inline-block py-4">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="relative z-10">Seamless </span>
            <motion.span
              className="text-[#6387CE] relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Scheduling
            </motion.span>
            <br />
            <span className="relative z-10">Ultimate </span>
            <motion.span
              className="text-[#6387CE] relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Productivity
            </motion.span>
          </motion.h1>
          {/* Efek blur lingkaran */}
          <motion.div
            className="absolute -bottom-4 -left-6 w-20 h-20 bg-[#6387CE]/10 rounded-full blur-xl z-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          />
          <motion.div
            className="absolute top-1/4 -right-10 w-32 h-32 bg-[#6387CE]/10 rounded-full blur-xl z-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>

        <motion.p
          className="text-lg text-gray-700 mt-8 max-w-sm mx-auto md:mx-0 text-justify"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Scheduro helps you manage your tasks and time effectively, giving you
          the control to focus on what truly matters.
        </motion.p>

        {isDesktop ? (
          <motion.button
            onClick={scrollToAbout}
            className="bg-[#6387CE] text-white px-5 py-3 rounded-lg flex items-center shadow-md hover:bg-[#4058A4] mt-8 md:mt-12 mx-auto md:mx-0 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(99, 135, 206, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            aria-label="Scroll to About section" // Aksesibilitas
          >
            <ArrowDown className="w-5 h-5 mr-2" />
            <span className="text-base font-medium">Explore!</span>
          </motion.button>
        ) : (
          <motion.a
            href="https://play.google.com/store/apps/details?id=com.scheduro.app&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#6387CE] text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:bg-[#4058A4] mt-8 md:mt-12 mx-auto md:mx-0 transition-all duration-300 w-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(99, 135, 206, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            aria-label="Download Scheduro on Google Play" // Aksesibilitas
          >
            <Play className="w-5 h-5 mr-2" />
            <div className="text-left flex flex-col">
              <span className="text-sm font-medium">GET IN ON</span>
              <span className="text-base font-semibold">Google Play</span>
            </div>
          </motion.a>
        )}
      </motion.div>

      {/* Gambar untuk desktop */}
      {isDesktop && (
        <motion.div
          className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0 relative"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6387CE]/10 rounded-full blur-3xl z-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          <motion.div
            className="relative z-10 md:ml-32"
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <Image
              src="https://res.cloudinary.com/dwgwb5vro/image/upload/v1741287250/char_1_1_ugxw4a.png"
              alt="Character with productivity icons"
              width={450} // Sesuaikan dengan lg:w-[450px]
              height={450}
              priority
              className="object-contain drop-shadow-2xl"
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
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;
