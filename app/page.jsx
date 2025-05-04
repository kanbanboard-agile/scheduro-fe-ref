'use client'; // Tambahkan ini karena kita menggunakan client-side hooks

import { Suspense, lazy, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

// Immediately loaded critical component
import Navbar from '@/components/Navbar';

// Preloaded component with highest priority
const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  ),
  ssr: true,
  priority: true, // Signals Next.js to preload this component
});

// Lazy-loaded components with suspense
const AboutSection = lazy(() => import('@/components/AboutSection'));
const FeatureSection = lazy(() => import('@/components/FeatureSection'));
const FAQSection = lazy(() => import('@/components/FAQSection'));
const CTASection = lazy(() => import('@/components/CTASection'));
const Footer = lazy(() => import('@/components/Footer'));

// Light fallback component for suspense
const SectionLoader = () => (
  <div className="w-full py-8 flex justify-center">
    <div className="w-12 h-12 border-t-2 border-gray-300 border-solid rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to /dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [authLoading, user, router]);

  // Render loading state while checking auth
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the page only for non-authenticated users
  if (!user) {
    return (
      <>
        <Head>
          <title>Your Website</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="description" content="Your website description" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* Add preloads for critical assets here */}
        </Head>

        {/* Navigation - always loaded first */}
        <Navbar />

        <main>
          {/* Hero Section - preloaded priority */}
          <HeroSection />

          {/* Other sections load as they come into viewport */}
          <Suspense fallback={<SectionLoader />}>
            <AboutSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <FeatureSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <FAQSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <CTASection />
          </Suspense>
        </main>

        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </>
    );
  }

  // Return null while redirecting (this should never be reached due to useEffect)
  return null;
}
