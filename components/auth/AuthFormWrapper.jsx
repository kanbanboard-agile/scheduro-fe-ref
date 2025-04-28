// components/auth/AuthFormWrapper.jsx
"use client";
import Link from "next/link";

export default function AuthFormWrapper({
  title,
  subtitle,
  children,
  linkText,
  linkHref,
}) {
  return (
    <div className="flex flex-1 justify-center items-center px-4 py-8 overflow-auto">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-[#6387CE]">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        {children}
        <p className="mt-6 text-center text-sm text-gray-600">
          {linkText}{" "}
          <Link href={linkHref} className="text-[#6387CE] hover:underline">
            {linkText.includes("Already") ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}
