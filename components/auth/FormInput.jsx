// components/auth/FormInput.jsx
"use client";
import { Eye, EyeOff } from "lucide-react";

export default function FormInput({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  showToggle = false,
  isVisible,
  toggleVisibility,
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showToggle ? (isVisible ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6387CE]"
          aria-label={label}
        />
        {showToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label={
              isVisible
                ? `Hide ${label.toLowerCase()}`
                : `Show ${label.toLowerCase()}`
            }
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
