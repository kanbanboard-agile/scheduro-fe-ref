"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function OAuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const code = searchParams.get("code");
        const token = searchParams.get("token");

        if (token) {
            toast.success("Login successful! Redirecting...");
            router.push("/dashboard");
            return;
        }

        async function exchangeCode() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/auth/google`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code }),
                    }
                );

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Failed to authenticate");
                }

                // Assuming backend sets cookie or returns session info
                toast.success("Login successful! Redirecting...");
                router.push("/dashboard");
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || "Authentication failed";
                toast.error(errorMessage);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        exchangeCode();
    }, [router, searchParams]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Authenticating...</p>
            </div>
        );
    }

    return null;
}
