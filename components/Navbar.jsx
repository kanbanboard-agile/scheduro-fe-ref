"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Navbar = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleScroll = () => {
    const about = document.getElementById("about");
    const feature = document.getElementById("feature");
    const faq = document.getElementById("faq");
    const download = document.getElementById("download");

    if (window.scrollY >= (download?.offsetTop || 0) - 100) {
      setActiveSection("download");
    } else if (window.scrollY >= (faq?.offsetTop || 0) - 100) {
      setActiveSection("faq");
    } else if (window.scrollY >= (feature?.offsetTop || 0) - 100) {
      setActiveSection("feature");
    } else if (window.scrollY >= (about?.offsetTop || 0) - 100) {
      setActiveSection("about");
    } else {
      setActiveSection("home");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const linkClass = (section) =>
    `font-poppins transition-colors cursor-pointer text-sm ${
      activeSection === section
        ? "text-[#6387CE] font-bold"
        : "text-black hover:text-[#6387CE]"
    }`;

  return (
    <nav
      className={`bg-gray-50 py-4 px-5 sticky top-0 z-50 w-full shadow-md ${className}`}
    >
      <div className="flex items-center justify-between w-full max-w-[1200px] mx-auto">
        {/* Logo */}
        <div className="flex items-center ml-2 md:ml-0">
          <Image
            src="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1742279884/logo_ovq2n3.svg"
            alt="Scheduro Logo"
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="text-[19px] md:text-[26px] font-bold ml-2 font-poppins">
            Scheduro
          </span>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button className="flex items-center p-2" onClick={toggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#6387CE"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-10">
          <ul className="flex items-center">
            <li className="mx-4">
              <Link href="/" className={linkClass("home")}>
                Home
              </Link>
            </li>
            <li className="mx-4">
              <button
                onClick={() => handleNavClick("about")}
                className={linkClass("about")}
              >
                About
              </button>
            </li>
            <li className="mx-4">
              <button
                onClick={() => handleNavClick("feature")}
                className={linkClass("feature")}
              >
                Features
              </button>
            </li>
            <li className="mx-4">
              <button
                onClick={() => handleNavClick("faq")}
                className={linkClass("faq")}
              >
                FAQ
              </button>
            </li>
            <li className="mx-4">
              <button
                onClick={() => handleNavClick("download")}
                className={linkClass("download")}
              >
                Download
              </button>
            </li>
          </ul>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4 ml-10">
          <Link href="/login">
            <Button className="bg-[#6387CE] text-white px-8 py-3 rounded-full shadow-md hover:bg-[#4F6EC1]">
              <span className="text-base font-medium">Login</span>
            </Button>
          </Link>
          <Link href="/register">
            <Button className="border-2 border-[#6387CE] text-[#6387CE] bg-transparent px-8 py-3 rounded-full shadow-md hover:bg-[#4F6EC1] hover:text-white">
              <span className="text-base font-medium">Register</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white p-4 shadow-md z-50 border-t border-gray-100">
          <ul className="flex flex-col space-y-3 pt-2 mb-4 text-sm">
            <li>
              <Link
                href="/"
                className={linkClass("home")}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("about")}
                className={linkClass("about")}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("feature")}
                className={linkClass("feature")}
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("faq")}
                className={linkClass("faq")}
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("download")}
                className={linkClass("download")}
              >
                Download
              </button>
            </li>
          </ul>

          <div className="grid grid-cols-2 gap-2">
            <Link href="/login">
              <Button className="w-full bg-[#6387CE] text-white rounded-full shadow-md hover:bg-[#4F6EC1]">
                <span className="text-sm font-medium">Login</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full border-2 border-[#6387CE] text-[#6387CE] bg-transparent rounded-full shadow-md hover:bg-[#4F6EC1] hover:text-white">
                <span className="text-sm font-medium">Register</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
