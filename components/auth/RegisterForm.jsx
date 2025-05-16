'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';
import AuthFormWrapper from './AuthFormWrapper';
import FormInput from './FormInput';
import { registerUser } from '@/lib/api/user';

// Performance-optimized RegisterForm component
export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Memoized form validation function
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const phoneRegex = /^\+?\d{7,15}$/;
    if (formData.number && !phoneRegex.test(formData.number)) {
      newErrors.number = 'Please enter a valid phone number (7-15 digits)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, agreeToTerms]);

  // Memoized input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  // Memoized checkbox change handler
  const handleTermsChange = useCallback((e) => {
    setAgreeToTerms(e.target.checked);
    setErrors((prev) => ({ ...prev, terms: '' }));
  }, []);

  // Memoized password visibility toggles
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // Optimized form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        number: formData.number,
        password: formData.password,
      });

      toast.success('Registration successful! Redirecting to login...');

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        number: '',
        password: '',
        confirmPassword: '',
      });
      setAgreeToTerms(false);

      // Delay redirect to show toast
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';

      toast.error(errorMessage);
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Memoized button class based on state
  const buttonClass = useMemo(() => {
    return `w-full font-medium py-2 rounded-md transition-all duration-300 ${loading || !agreeToTerms ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#6387CE] text-white hover:bg-[#4058A4] cursor-pointer'}`;
  }, [loading, agreeToTerms]);

  return (
    <AuthFormWrapper title="Create an Account" subtitle="Register now & manage your time and tasks with ease!" linkText="Already have an account?" linkHref="/login">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Toaster
          position="top-center"
          theme="light"
          style={{
            zIndex: 9999,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
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
          placeholder="Enter your full name"
          error={errors.name}
          required
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
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
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        <FormInput
          id="number"
          label="Phone Number"
          type="tel"
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="e.g., +6281234567890 (Optional)"
          error={errors.number}
          aria-invalid={errors.number ? 'true' : 'false'}
          aria-describedby={errors.number ? 'number-error' : undefined}
        />
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
          toggleVisibility={togglePassword}
          required
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          showToggle
          isVisible={showConfirmPassword}
          toggleVisibility={toggleConfirmPassword}
          required
          aria-invalid={errors.confirmPassword ? 'true' : 'false'}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
        />

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            checked={agreeToTerms}
            onChange={handleTermsChange}
            className="h-4 w-4 rounded border-gray-300 accent-[#6387CE] focus:ring-[#6387CE]"
            aria-label="Agree to terms and privacy policy"
            aria-invalid={errors.terms ? 'true' : 'false'}
            aria-describedby={errors.terms ? 'terms-error' : undefined}
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            I agree with the{' '}
            <Link href="/policy" className="text-[#6387CE] hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
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

        <button type="submit" disabled={!agreeToTerms || loading} className={buttonClass} aria-label="Register">
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
      <Link href="/">
        <button
          className="cursor-pointer fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Back to Home"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </Link>
    </AuthFormWrapper>
  );
}
