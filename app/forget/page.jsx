'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import IllustrationSection from '@/components/auth/IllustrationSection';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function ForgetPasswordPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [turnstileError, setTurnstileError] = useState(null);
  const { requestPasswordReset } = useAuth();
  const router = useRouter();

  // Load Turnstile script and render widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.turnstile) {
        window.turnstile.render('#turnstile-widget', {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, // Add site key in .env
          callback: () => {
            setTurnstileVerified(true); // Verification successful, show page
          },
          'error-callback': () => {
            setTurnstileError('Turnstile verification failed. Please try again.');
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Pre-fill email from query parameter
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      localStorage.setItem('resetEmail', email);
      setMessage('A verification code has been sent to your email.');
      setTimeout(() => {
        router.push('/forget/verifyotp');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
      setIsLoading(false);
    }
  };

  // Show only Turnstile widget if not verified
  if (!turnstileVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div id="turnstile-widget"></div>
        <p>Verifying...</p>
      </div>
    );
  }

  // Show error if Turnstile verification fails
  if (turnstileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{turnstileError}</p>
      </div>
    );
  }

  // Show Forget Password page if verified
  return (
    <div className="flex min-h-screen w-full">
      <IllustrationSection
        title="Forgot Your Password?"
        description="No worries, we'll help you reset it."
        imageSrc="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745053743/login_ae8k5s.svg?q_auto,f_webp"
        alt="Illustration of password recovery"
      />
      <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Reset Password</h2>
          {message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{message}</div>}
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Link href="/">
        <button
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Back to Home"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
