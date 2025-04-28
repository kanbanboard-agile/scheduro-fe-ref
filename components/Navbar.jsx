"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Navbar = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleScroll = useCallback(() => {
    const sections = ["about", "feature", "faq", "download"];
    let currentSection = "home";

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element && window.scrollY >= element.offsetTop - 100) {
        currentSection = section;
      }
    }
    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const linkClass = (section) =>
    `font-poppins transition-colors cursor-pointer ${activeSection === section
      ? "text-[#6387CE] font-bold"
      : "text-black hover:text-[#6387CE]"
    }`;

  const NavLinks = ({ isMobile = false }) => (
    <ul className={`flex ${isMobile ? "flex-col space-y-4 mb-4" : "items-center"}`}>
      <li className="mx-6 md:mx-6">
        <Link href="/" className={linkClass("home")} onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
      </li>
      {["about", "feature", "faq", "download"].map((section) => (
        <li key={section} className="mx-6 md:mx-6">
          <button onClick={() => handleNavClick(section)} className={linkClass(section)}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        </li>
      ))}
    </ul>
  );

  const AuthButtons = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? "flex-col items-start space-y-3" : "items-center space-x-4 ml-8 mr-20"}`}>
      <Link href="/login">
        <Button className="bg-[#6387CE] text-white px-6 md:px-10 py-3 md:py-6 rounded-full shadow-md hover:bg-[#4F6EC1]">
          <span className="text-base font-medium">Login</span>
        </Button>
      </Link>
      <Link href="/register">
        <Button className="border-2 border-[#6387CE] text-[#6387CE] bg-transparent px-6 md:px-10 py-3 md:py-6 rounded-full shadow-md hover:bg-[#4F6EC1] hover:text-white">
          <span className="text-base font-medium">Register</span>
        </Button>
      </Link>
    </div>
  );

  return (
    <nav className={`bg-gray-50 py-4 px-5 flex items-center justify-between mt-5 sticky top-0 z-50 ${className}`}>
      {/* Logo */}
      <div className="flex items-center ml-2 md:ml-[85px]">
        <Image
          src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742279884/logo_ovq2n3.svg"
          alt="Scheduro Logo"
          width={48}
          height={48}
          className="object-contain"
        />
        <span className="text-[19px] md:text-[26px] font-bold ml-2 font-poppins">Scheduro</span>
      </div>

      {/* Mobile Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button className="p-2" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#6387CE"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white p-4 shadow-md z-50 border-t border-gray-100">
          <NavLinks isMobile />
          <AuthButtons isMobile />
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 items-center justify-between">
        <div className="flex-1 flex justify-center">
          <NavLinks />
        </div>
        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;
