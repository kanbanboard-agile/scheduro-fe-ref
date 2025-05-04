'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IllustrationSection from '@/components/auth/IllustrationSection';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately when authenticated
    if (!loading && user) {
      router.replace('/dashboard'); // Use `replace` to prevent going back to login
    }
  }, [user, loading, router]);

  if (loading || user) {
    // Prevent any UI flash of login page if user is already authenticated
    return null;
  }

  return (
    <div className="flex min-h-screen w-full">
      <IllustrationSection
        title="Too Busy? Just"
        description="Stay organized, stay stress-free."
        imageSrc="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1745053743/login_ae8k5s.svg?q_auto,f_webp"
        alt="Illustration of a person managing tasks"
      />
      <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto p-4">
        <LoginForm />
      </div>
    </div>
  );
}
