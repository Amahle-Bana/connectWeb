"use client"

import { ResetPasswordForm } from "@/components/reset-password-authentication-page/resetpassword-form";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

// Reset Password Page
export default function ResetPasswordPage() {
    const router = useRouter()

    return (
        // Reset Password Page
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-playfair-display">
            
            <motion.div
                className="flex w-full max-w-sm flex-col gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Reset Password Form Component */}
                <ResetPasswordForm />
            </motion.div>
        </div>
    );
}

