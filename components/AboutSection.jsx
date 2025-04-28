"use client";
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash"; // Tambahkan lodash untuk debouncing
import Image from "next/image";

// components/ParallaxImage.jsx
export function ParallaxImage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = useCallback(
    debounce((e) => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    }, 16), // Debounce setiap 16ms (~60fps)
    []
  );

  return (
    <div
      className="w-full md:w-1/2 flex justify-center overflow-hidden rounded-lg"
      ref={imageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      role="img"
      aria-label="Interactive Scheduro app preview"
    >
      <motion.div
        className="perspective-1000 relative"
        animate={{
          rotateY: mousePosition.x * 10,
          rotateX: -mousePosition.y * 10,
          scale: 1.05,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        whileHover={{ scale: 1.08 }}
      >
        <Image
          src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742232295/widgets_b9ap96.svg?q_auto,f_webp"
          alt="Scheduro app on iPhone"
          width={700}
          height={700}
          className="w-full max-w-[500px] md:max-w-[700px] p-4 scale-115 rounded-lg shadow-xl"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
        />
      </motion.div>
    </div>
  );
}

// components/AboutSection.jsx
export function FeaturesList({ features }) {
  return (
    <div className="w-full md:w-1/2 flex flex-col gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-start gap-4 py-4 transition-transform hover:scale-105"
        >
          <Image
            src={feature.icon}
            alt={`${feature.title} icon`}
            width={48}
            height={48}
            className="flex-shrink-0"
            loading="lazy"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-base text-gray-700">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const features = [
  {
    icon: "https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742133789/easy-to-use_j32exn.svg?q_auto,f_webp",
    title: "Easy to Use",
    description: "Scheduro simplifies scheduling and boosts productivity.",
  },
  {
    icon: "https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742133857/seamless_y02psa.svg?q_auto,f_webp",
    title: "Seamless Management",
    description: "Handle meetings, appointments, and tasks effortlessly.",
  },
  {
    icon: "https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742134010/maximum_ltexcl.svg?q_auto,f_webp",
    title: "Maximum Efficiency",
    description: "Everything you need in one complete solution.",
  },
  {
    icon: "https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742134058/effortless_fwsatf.svg?q_auto,f_webp",
    title: "Effortless Time Control",
    description: "Take charge of your schedule with ease using Scheduro!",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-16 px-8 md:px-16 bg-gray-50"
      aria-label="About Scheduro"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-[#6387CE] font-bold mb-10 text-xl">
          ABOUT
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
          <ParallaxImage />
          <FeaturesList features={features} />
        </div>
      </div>
    </section>
  );
}
