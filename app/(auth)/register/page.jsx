'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import IllustrationSection from '@/components/auth/IllustrationSection';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/lib/AuthContext';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [turnstileError, setTurnstileError] = useState(null);

  // Alihkan ke dashboard jika sudah terautentikasi
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  // Muat skrip Turnstile dan render widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.turnstile) {
        window.turnstile.render('#turnstile-widget', {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: () => {
            setTurnstileVerified(true);
          },
          'error-callback': () => {
            setTurnstileError('Try Again Bro!');
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Jika loading atau sudah terautentikasi, jangan tampilkan apa-apa
  if (loading || user) {
    return null;
  }

  // Jika ada error Turnstile, tampilkan pesan error
  if (turnstileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{turnstileError}</p>
      </div>
    );
  }

  // Jika belum terverifikasi, hanya tampilkan widget Turnstile
  if (!turnstileVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div id="turnstile-widget"></div>
        <p>Memverifikasi...</p>
      </div>
    );
  }

  // Jika terverifikasi, tampilkan halaman registrasi
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
