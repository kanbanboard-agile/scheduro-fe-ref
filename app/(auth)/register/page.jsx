'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IllustrationSection from '@/components/auth/IllustrationSection';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/lib/AuthContext';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (!loading && user) {
      router.replace('/dashboard'); // Prevent going back to register page
    }
  }, [user, loading, router]);

  // Prevent showing the page content if user is authenticated or still loading
  if (loading || user) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full">
      <IllustrationSection
        title="Too Busy? Just"
        description="Register now & manage your time and tasks with ease!"
        imageSrc="https://res.cloudinary.com/dy8fe8tbe/image/upload/v1744596970/register_jioycx.svg?q_auto,f_webp"
        alt="Illustration of a person registering"
      />
      <RegisterForm />
    </div>
  );
}
