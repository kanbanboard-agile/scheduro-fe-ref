'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import IllustrationSection from '@/components/auth/IllustrationSection';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyResetOTP } = useAuth();
  const router = useRouter();
  const inputRefs = useRef([]);

  const handleInputChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      const verifyCode = async () => {
        setIsLoading(true);
        setError('');
        const email = localStorage.getItem('resetEmail');
        const otpCode = otp.join('');

        try {
          const response = await verifyResetOTP({ email, otp: otpCode });
          // Store resetToken in localStorage
          if (response?.data?.resetToken) {
            localStorage.setItem('resetToken', response.data.resetToken);
          }
          router.push('/forget/resetpassword');
        } catch (err) {
          setError(err.message || 'Invalid or expired OTP. Please try again.');
          setOtp(['', '', '', '', '']);
          inputRefs.current[0].focus();
        } finally {
          setIsLoading(false);
        }
      };

      verifyCode();
    }
  }, [otp, verifyResetOTP, router]);

  return (
    <div className="flex min-h-screen w-full">
      <IllustrationSection
        title="Verify Your Code"
        description="Enter the 5-digit code sent to your email."
        imageSrc="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745053743/login_ae8k5s.svg?q_auto,f_webp"
        alt="Illustration of OTP verification"
      />
      <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enter Verification Code</h2>
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
          <div className="flex justify-center space-x-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength={1}
                disabled={isLoading}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Didn’t receive a code?{' '}
            <Link href="/forget" className="font-medium text-indigo-600 hover:text-indigo-500">
              Resend
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
