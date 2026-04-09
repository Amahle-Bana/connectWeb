"use client"

// Imports
import { motion } from "framer-motion"
import { LoginForm } from "@/components/login-authentication-page/login-form"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { ClipLoader } from 'react-spinners'

// Login Page
export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, emailVerified, loading } = useAuth();

    // Redirect verified users with valid JWT to home page
    useEffect(() => {
        if (!loading) {
            if (isAuthenticated && emailVerified) {
                // User is verified and has valid JWT - redirect to home
                router.replace('/home');
            }
            // If not authenticated, show login form (current behavior)
        }
    }, [isAuthenticated, emailVerified, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-playfair-display">
                <ClipLoader color="#000" size={50} />
            </div>
        );
    }

    // If authenticated and verified, don't render login form (will redirect)
    if (isAuthenticated && emailVerified) {
        return null;
    }

    return (
        // Login Page Container
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-playfair-display relative">

            {/* Login Form Div */}
            <motion.div
                className="flex w-full max-w-sm flex-col gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Login Form Component */}
                <LoginForm />
            </motion.div>
        </div>
    )
}
