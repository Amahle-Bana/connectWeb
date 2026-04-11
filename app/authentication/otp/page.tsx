"use client"

/**
 * Email OTP verification page — disabled.
 * Redirects to login. Restore the previous UI using OTP_IMPLEMENTATION_RESTORE.md (or git history).
 */
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OTPVerificationPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/authentication")
    }, [router])

    return null
}
