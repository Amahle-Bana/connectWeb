"use client"

import { motion } from "framer-motion"

import { SignUpForm } from "@/components/signup-authentication-page/signup-form"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {

    return (
        // Sign-Up Page
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-playfair-display">

            {/* Sign-Up Form */}
            <motion.div
                className="flex w-full max-w-sm flex-col gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}   
                transition={{ duration: 0.5 }}
            >
                {/* Sign-Up Form Component */}
                <SignUpForm />
            </motion.div>
        </div>
    )
}