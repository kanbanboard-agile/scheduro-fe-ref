// components/auth/LoginForm.jsx
'use client';
import { useState, useCallback, useMemo } from 'react';
import AuthFormWrapper from './AuthFormWrapper';
import { Toaster, toast } from 'sonner';
import FormInput from './FormInput';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

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
        <FormInput id="email" label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" error={errors.email} />
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4F6EC1] text-white font-medium py-2 rounded-md hover:bg-[#6387CE] transition-all duration-300 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Log in"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </AuthFormWrapper>
  );
}
