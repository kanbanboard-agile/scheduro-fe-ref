"use client";

import { useState } from "react";
import Image from "next/image";

// FAQ Data
const faqItems = [
  {
    question: "Apa itu Scheduro?",
    answer:
      "Scheduro adalah aplikasi yang dirancang untuk membantumu mengelola tugas dan waktumu secara efektif. Dengan Scheduro, Anda memiliki kendali penuh untuk memprioritaskan dan fokus pada hal-hal yang benar-benar penting bagimu.",
  },
  {
    question: "Bagaimana Scheduro membantu mengatur tugas?",
    answer:
      "Scheduro menyediakan fitur untuk membuat daftar tugas, menetapkan tenggat waktu, memberikan prioritas, dan melacak progresnya. Dengan visibilitas yang jelas terhadap semua tugasmu, Anda dapat mengatur tugasmu dengan lebih terstruktur.",
  },
  {
    question: "Apa manfaat menggunakan Scheduro untuk manajemen waktu?",
    answer:
      "Manfaat utama Scheduro dalam manajemen waktu adalah membantumu mengidentifikasi bagaimana waktumu digunakan, mengalokasikan waktu secara lebih efisien untuk tugas-tugas yang paling signifikan. Ini membantu mengurangi penundaan dan meningkatkan produktivitas.",
  },
  {
    question: "Apakah ada batasan jumlah tugas yang dapat dikelola?",
    answer:
      "Saat ini, Scheduro tidak memberlakukan batasan jumlah tugas yang dapat Anda kelola, sehingga Anda bebas mengatur semua tugas Anda.",
  },
  {
    question: "Apakah Scheduro mudah digunakan?",
    answer:
      "Scheduro dirancang dengan antarmuka yang intuitif dan mudah dipahami, sehingga Anda dapat dengan cepat mulai mengelola tugas dan waktumu tanpa kesulitan. Fokusnya adalah memberikan kontrol yang sederhana namun efektif.",
  },
];

// Accordion Item Component
function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex w-full justify-between py-4 text-left font-medium focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-base md:text-lg flex-1">{question}</span>
        <svg
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 text-sm md:text-base text-justify">
          {answer}
        </p>
      </div>
    </div>
  );
}

// FAQ Section Component
export default function FAQSection() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="w-full px-6 py-16 md:py-24 bg-gradient-to-b from-[#E2EAF7] to-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-[#6387CE] text-2xl font-bold tracking-wider text-center mb-2">
          FAQ's
        </h2>
        <h3 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-8">
          Questions? Look here.
        </h3>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="flex-1 md:sticky md:top-20 h-fit">
            <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl flex justify-center">
              <Image
                src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745596674/FAQ_ihx6j5.svg"
                alt="FAQ Illustration"
                width={400}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* FAQ List Section */}
          <div className="flex-1">
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openItem === index}
                  onClick={() => toggleItem(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}