// app/login/page.jsx
"use client";
import IllustrationSection from "@/components/auth/IllustrationSection";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {

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
