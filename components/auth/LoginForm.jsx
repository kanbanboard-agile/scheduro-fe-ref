// components/auth/LoginForm.jsx
"use client";
import { useState, useCallback } from "react";
import AuthFormWrapper from "./AuthFormWrapper";
import { Toaster, toast } from "sonner";
import FormInput from "./FormInput";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      await login(payload);
      toast.success("Login successful! Redirecting to dashboard...");
      setFormData({ email: "", password: "" });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Welcome Back!"
      subtitle="Login now & start managing your time and tasks more efficiently!"
      linkText="Don't have an account? "
      linkHref="/register"
    >
      <Toaster position="top-center" theme="light" richColors />
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@email.com"
          error={errors.email}
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
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F6EC1] text-white font-medium py-2 rounded-md hover:bg-[#6387CE] transition-all duration-300 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Log in"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="flex items-center justify-center">
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
            aria-label="Login with Google"
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
      </form>
    </AuthFormWrapper>
  );
}
