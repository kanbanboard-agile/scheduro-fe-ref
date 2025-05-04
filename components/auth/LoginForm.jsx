'use client';
import { useState, useCallback } from 'react';
import AuthFormWrapper from './AuthFormWrapper';
import { Toaster, toast } from 'sonner';
import FormInput from './FormInput';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Memoized validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, formData.password]);

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Optimized submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success('Login successful! Redirecting to dashboard...');
      setFormData({ email: '', password: '' });

      // Using setTimeout to ensure toast is visible before redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Memoized toggle function
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <AuthFormWrapper title="Welcome Back!" subtitle="Login now & start managing your time and tasks more efficiently!" linkText="Don't have an account? " linkHref="/register">
      <Toaster position="top-center" theme="light" richColors />
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput id="email" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" error={errors.email} autoFocus />
        <FormInput
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
          error={errors.password}
          showToggle
          isVisible={showPassword}
          toggleVisibility={togglePasswordVisibility}
        />
        <div className="flex items-center justify-between">
          <Link href="/forget" className="text-sm text-primary hover:underline -mt-2">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white font-medium py-2 rounded-md hover:bg-primary-dark transition-all duration-300 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Log in"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      <Link href="/">
        <button
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Back to Home"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </Link>
    </AuthFormWrapper>
  );
}
