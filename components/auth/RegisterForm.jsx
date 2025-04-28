"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import AuthFormWrapper from "./AuthFormWrapper";
import FormInput from "./FormInput";
import { registerUser } from "@/lib/api/user";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/auth/google`;
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    const phoneRegex = /^\+?\d{7,15}$/;
    if (!formData.number) {
      newErrors.number = "Phone number is required";
    } else if (!phoneRegex.test(formData.number)) {
      newErrors.number = "Please enter a valid phone number (7-15 digits)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms =
        "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      number: formData.number,
      password: formData.password,
    };

    try {
      const response = await registerUser(payload);

      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
        duration: 3000,
      });

      setFormData({
        name: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: "",
      });
      setAgreeToTerms(false);
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      toast.error(errorMessage, {
        position: "top-right",
        duration: 5000,
      });

      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Create an Account"
      subtitle="Register now & manage your time and tasks with ease!"
      linkText="Already have an account?"
      linkHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Toaster
          position="top-center"
          theme="light"
          style={{
            zIndex: 9999,
            position: "absolute",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          richColors
        />

        <FormInput
          id="name"
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter name"
          error={errors.name}
          required
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@gmail.com"
          error={errors.email}
          required
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        <FormInput
          id="number"
          label="Phone Number"
          type="tel"
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="089654567877"
          error={errors.number}
          required
          aria-invalid={errors.number ? "true" : "false"}
          aria-describedby={errors.number ? "number-error" : undefined}
        />
        <FormInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
          showToggle
          isVisible={showPassword}
          toggleVisibility={() => setShowPassword(!showPassword)}
          required
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          error={errors.confirmPassword}
          showToggle
          isVisible={showConfirmPassword}
          toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
          required
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
        />

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-[#6387CE] focus:ring-[#6387CE]"
            aria-label="Agree to terms and privacy policy"
            aria-invalid={errors.terms ? "true" : "false"}
            aria-describedby={errors.terms ? "terms-error" : undefined}
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            I agree with the{" "}
            <Link href="/terms" className="text-[#6387CE] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#6387CE] hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {errors.terms && (
          <p id="terms-error" className="text-sm text-red-600" role="alert">
            {errors.terms}
          </p>
        )}
        {serverError && (
          <div className="text-red-600 text-sm" role="alert">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={!agreeToTerms || loading}
          className={`w-full font-medium py-2 rounded-md transition-all duration-300 ${loading || !agreeToTerms
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#6387CE] text-white hover:bg-[#4058A4] cursor-pointer"
            }`}
          aria-label="Register"
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <div className="mt-6 w-full">
          <div className="flex items-center justify-center mt-4 ">
            <p className="text-sm text-gray-500">
              Or
            </p>
          </div>

          <div className="mt-6 w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleGoogleLogin}
              aria-label="Register with Google"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24"
                height="24"
                className="inline-block"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.7 1.22 9.18 3.22l6.86-6.86C34.6 2.9 29.6 1 24 1 14.8 1 6.7 6.9 3.3 15.9l7.98 6.2C12.9 15.1 18.9 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24c0-1.6-.14-3.14-.4-4.62H24v9.12h12.7c-.54 2.9-2.2 5.36-4.7 7.02l7.2 5.6c4.2-3.9 6.6-9.6 6.6-16.12z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.3 28.1c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7L2.3 12.5C.8 16.1 0 20 0 24s.8 7.9 2.3 11.5l8-7.4z"
                />
                <path
                  fill="#34A853"
                  d="M24 46c6.5 0 12-2.1 16-5.7l-7.2-5.6c-2 1.3-4.5 2-7 2-5.1 0-9.4-3.4-10.9-8.1l-8 6.2C9.9 41.8 16.5 46 24 46z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Login with Google
            </Button>
          </div>
        </div>
      </form>
    </AuthFormWrapper>
  );
}
