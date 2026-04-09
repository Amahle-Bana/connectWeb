"use client"

import { ChangePasswordForm } from "@/components/change-password-authentication-page/changepassword-form";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const router = useRouter()

    return (
        // Change Password Page
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-playfair-display">

            <motion.div
                className="flex w-full max-w-sm flex-col gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Change Password Form Component */}
                <ChangePasswordForm />
            </motion.div>
        </div>
    );
}