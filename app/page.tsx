"use client"

// Imports
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";



// Landing Page
export default function LandingPage() {

    // State Variables
    const { isAuthenticated, loading } = useAuth();
    const userData = useAppSelector((state) => state.user);

    // Router
    const router = useRouter();


    // useEffect For Redirecting Logic To Home Page Or Login Page
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (!loading) {
            timeout = setTimeout(() => {
                if (isAuthenticated) {
                    router.replace('/home');
                } else {
                    router.replace('/welcome-to-box');
                }
            }, 3000); // 3 seconds delay
        }
        return () => clearTimeout(timeout);
    }, [isAuthenticated, loading, router, userData]);


    // The Loading Page
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-screen bg-[rgb(255,255,255)]">

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <img src="/icons8-box-800.png" alt="Logo" className="w-40 h-40" />
            </motion.div>
        </div>
    )
}