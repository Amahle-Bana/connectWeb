"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"
import { SyntheticEvent, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ClipLoader } from 'react-spinners';
import { CheckCircle2, XCircle, Mail } from 'lucide-react';
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";

export default function OTPVerificationPage() {
    // Get email from URL parameters
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const mode = searchParams.get('mode') || 'login';

    // State Variables
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    // Router and Auth Context
    const router = useRouter();
    const { verifyOTP, resendOTP, refreshUserData } = useAuth();

    // Theme support
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            if (mode === 'signup') {
                router.push('/authentication/signup');
            } else {
                router.push('/authentication/login');
            }
        }
    }, [email, mode, router]);

    // OTP Verification Form Submit Handler
    const handleOTPSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        // OTP length validation
        if (otp.length !== 6) {
            setErrorMessage('Please enter a complete 6-digit OTP');
            setIsLoading(false);
            return;
        }

        // Verify OTP
        verifyOTP(email, otp)
            .then(async (result: { success: boolean; message: string }) => {
                if (result && result.success) {
                    // Refresh user data to pick up the new JWT and verified status
                    await refreshUserData();
                    router.push('/home');
                } else if (result) {
                    setErrorMessage(result.message);
                }
            })
            .catch(() => {
                setErrorMessage('An error occurred during OTP verification');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Resend OTP Handler
    const handleResendOTP = () => {
        setResendLoading(true);
        setResendMessage("");

        resendOTP(email)
            .then((result: { success: boolean; message: string }) => {
                if (result && result.success) {
                    setResendMessage("OTP sent successfully!");
                } else if (result) {
                    setResendMessage(result.message);
                }
            })
            .catch(() => {
                setResendMessage('An error occurred while resending OTP');
            })
            .finally(() => {
                setResendLoading(false);
            });
    };

    if (!email) {
        return null; // Will redirect
    }

    return (
        <div className={cn("flex flex-col gap-6", "min-h-screen flex items-center justify-center p-4")}>
            <Card className="bg-background border rounded-3xl font-comfortaa w-full max-w-md">
                {/* OTP Verification Form Header */}
                <CardHeader className="text-center">
                    <div className="flex flex-col gap-4 items-center">
                        {mounted && (
                            <img
                                src={
                                    theme === "dark"
                                        ? "/icons8-light-box-480.png"
                                        : "/icons8-box-480.png"
                                }
                                alt="CampusPoll logo"
                                className="w-30 h-30 object-contain"
                            />
                        )}
                    </div>
                    <CardTitle className="text-xl text-primary font-bold">Verify Your Account</CardTitle>
                    <CardDescription className="text-primary">
                        Enter the 6-digit code sent to your email
                    </CardDescription>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{email}</span>
                    </div>
                </CardHeader>
                {/* OTP Verification Form Content */}
                <CardContent>
                    <form onSubmit={handleOTPSubmit}>
                        <div className="grid gap-6">
                            {/* OTP Input */}
                            <div className="grid gap-3">
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                        disabled={isLoading}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>

                            {/* Error Message */}
                            <div className="text-red-500 text-sm text-center min-h-[20px]">
                                {errorMessage}
                            </div>

                            {/* Success Message */}
                            <div className="text-green-500 text-sm text-center min-h-[20px]">
                                {resendMessage}
                            </div>

                            {/* Verify OTP Button */}
                            <Button
                                type="submit"
                                className="hover:bg-secondary/90 w-full bg-secondary text-secondary-foreground cursor-pointer rounded-full"
                                disabled={isLoading || otp.length !== 6}
                                size="lg"
                            >
                                {isLoading ? (
                                    <ClipLoader color="#fff" size={20} />
                                ) : (
                                    'Verify Account'
                                )}
                            </Button>

                            {/* Resend OTP Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleResendOTP}
                                disabled={resendLoading}
                                className="w-full rounded-full"
                                size="lg"
                            >
                                {resendLoading ? (
                                    <ClipLoader color="#000" size={20} />
                                ) : (
                                    'Resend Code'
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Back to Signup Link */}
                    <div className="text-center text-sm text-primary mt-6">
                        Wrong email?{" "}
                        <Link href="/authentication/signup" className="underline underline-offset-4 text-primary">
                            Sign up again
                        </Link>
                    </div>
                </CardContent>
            </Card>
            {/* Terms and Privacy Link */}
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By verifying your account, you agree to our <Link href="/privacyPolicy" className="underline underline-offset-4">Privacy Policy</Link>{" "}
                and <Link href="/termsOfService" className="underline underline-offset-4">Terms of Service</Link>.
            </div>
        </div>
    )
}
