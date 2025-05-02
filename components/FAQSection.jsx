"use client";

import { useState } from "react";
import Image from "next/image";

// Custom Accordion Component
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
      <div>
          <button
              className="flex w-full justify-between py-4 text-left font-medium focus:outline-none cursor-pointer"
              onClick={onClick}
          >
              <span className="text-sm md:text-base flex-1">{question}</span>
              <svg
                  className={`h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : ""} md:mr-20`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-4" : "max-h-0"} md:mr-28 mr-2`}>
              <p className="text-gray-600 text-justify text-sm md:text-l">{answer}</p>
          </div>
      </div>
  )
}

export default function FAQSection() {
  const [openItem, setOpenItem] = useState(null)

  const toggleItem = (index) => {
      setOpenItem(openItem === index ? null : index)
  }

  const faqItems = [
      {
          question: "What is Scheduro?",
          answer:
              "Scheduro is an application designed to help you manage your tasks and time effectively. With Scheduro, you have full control to prioritize and focus on the things that truly matter to you.",
      },
      {
          question: "How does Scheduro help organize tasks?",
          answer:
              "Scheduro provides features to create task lists, set deadlines, assign priorities, and track progress. With clear visibility of all your tasks, you can organize them in a more structured way.",
      },
      {
          question: "What are the benefits of using Scheduro for time management?",
          answer:
              "The main benefits of Scheduro in time management are helping you identify how your time is spent and allocating it more efficiently to the most significant tasks. This helps reduce procrastination and increase productivity.",
      },
      {
          question: "Is there a limit to the number of tasks that can be managed?",
          answer:
              "Currently, Scheduro does not impose a limit on the number of tasks you can manage, so you are free to organize all your tasks.",
      },
      {
          question: "Is Scheduro easy to use?",
          answer:
              "Scheduro is designed with an intuitive and easy-to-understand interface, so you can quickly start managing your tasks and time without difficulty. The focus is on providing simple yet effective control.",
      },
  ]

  return (
      <section id="faq" className="w-full px-6 py-24 md:py-28 -mb-28 md:-mb-40 text-center bg-gradient-to-b from-[#E2EAF7] to-bg-gray-50">
          <h2 className="text-[#6387CE] text-2xl mb-2 md:mb-4 font-bold tracking-wider p-4">FAQ's</h2>
          <h2 className="text-center text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">Questions? Look here.</h2>

          <div className="flex flex-col gap-4 md:gap-8 md:flex-row">
              {/* Sticky Image Section */}
              <div className="flex-1 md:sticky md:top-20 h-fit md:-mt-14 md:-ml-8">
                  <div className="relative w-full h-[300px] md:h-[500px] overflow-hidden rounded-xl flex justify-center">
                      <Image
                          src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745596674/FAQ_ihx6j5.svg"
                          alt="FAQ Illustration"
                          width={500}
                          height={300}
                          className="w-full max-w-xs md:max-w-md h-auto"
                          priority
                      />
                  </div>
              </div>

              {/* FAQ List Section */}
              <div className="flex-1 -mt-4 md:mt-8 text-left md:-ml-24 md:mr-20">
                  <div className="rounded-lg space-y-2 p-8 md:p-6">
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
      </section>
  )
}