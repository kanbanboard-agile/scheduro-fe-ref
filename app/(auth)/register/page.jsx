// app/register/page.jsx
"use client";
import IllustrationSection from "@/components/auth/IllustrationSection";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
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
