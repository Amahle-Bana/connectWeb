import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { XCircle } from "lucide-react"
import { ClipLoader } from "react-spinners"
import { useTheme } from "next-themes";

// Reset Password Form Component
export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    // useState Variables
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // useRouter Hook
    const router = useRouter();
    // Theme support
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    

    // handleSubmit Function
    const handleSubmit = (e: React.FormEvent) => {
        // Preventing the default behavior of the form
        e.preventDefault()

        // Resetting the message and error
        setMessage("")
        setError("")
        setErrorMessage("")

        // Set loading state to true at the start
        setIsLoading(true)

        // @ Email Validation
        if (!email.includes('@gmail.com')) {
            setErrorMessage('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        // Email Length Validation
        if (email.length < 4) {
            setErrorMessage('Email must be at least 4 characters long');
            setIsLoading(false);
            if (email.includes('@gmail.com')) {
                setIsEmailValid(true);
            } else {
                setIsEmailValid(false);
            }
            return;
        }

        // Empty Email Validation
        if (email === '') {
            setErrorMessage('Fill In Your Email');
            setIsLoading(false);
            return;
        }

        // Fetching the reset password request
        fetch(`${process.env.NEXT_PUBLIC_RESET_PASSWORD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => response.json())
        .then(data => {
            // Checking if the response is ok
            if (data.message) {
                // Setting the message
                setMessage(data.message)
                // Redirecting to the login page
                // router.push('/login')
            } else {
                // Setting the error
                setError(data.error || 'An error occurred')
            }
        })
        .catch(error => {
            // Setting the error
            setError('An error occurred while processing your request')
        })
        .finally(() => {
            // Always set loading to false when done
            setIsLoading(false)
        })
    }

    // Email Validation Effect
    useEffect(() => {
        if (email === '') {
            setIsEmailValid(null);
            return;
        }
        setIsEmailValid(email.includes('@gmail.com'));
    }, [email]);


    // Returning the Reset Password Form
    return (
        // Reset Password Form Container
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-background border rounded-3xl font-comfortaa">
                {/* Reset Password Form Header */}
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
                    {/* Reset Password Form Title */}
                    <CardTitle className="text-xl text-primary font-bold">Reset Password</CardTitle>
                    {/* Reset Password Form Description */}
                    <CardDescription className="text-primary">
                        Enter your email to reset your password (Check your email for reset password link)
                    </CardDescription>
                </CardHeader>
                {/* Reset Password Form Content */}
                <CardContent>
                    {/* Reset Password Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <div className="grid gap-2">
                                {/* Email Input */}
                                <div className="grid gap-1">
                                    <Label htmlFor="email" className="flex justify-between items-center w-full">
                                        <p className="text-sm text-primary font-bold">Email</p>
                                        {isEmailValid === true ?
                                            <p className="text-green-500 text-xs">Valid Email Format</p>
                                            : isEmailValid === false ?
                                                <p className="text-red-500 text-xs">Invalid Email Format</p>
                                                : null}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={cn(
                                                isEmailValid === true && "rounded-full border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500 focus-visible:ring-[3px] text-black placeholder:text-black",
                                                isEmailValid === false && " rounded-full border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px] text-black placeholder:text-black",
                                                "pr-10 text-black rounded-full placeholder:text-gray-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                            )}
                                        />
                                        {/* Reset Password Form Email Validation Icon */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isEmailValid === true ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : isEmailValid === false ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                {/* Message */}
                                {message && (
                                    <div className="text-sm text-green-500 text-center">
                                        {message}
                                    </div>
                                )}
                                {/* Error */}
                                {(error || errorMessage) && (
                                    <div className="text-red-500 text-sm text-center">
                                        {error || errorMessage}
                                    </div>
                                )}
                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="hover:bg-secondary/90 w-full bg-secondary text-secondary-foreground cursor-pointer rounded-full"
                                    disabled={isLoading}
                                    size="lg"
                                >
                                    Reset Password
                                    {isLoading ? <ClipLoader color="#fff" size={20} /> : ''}
                                </Button>
                            </div>
                            {/* Back To Login Link */}
                            <div className="text-center text-sm text-primary">
                                Remember your password?{" "}
                                <Link href="/authentication" className="underline underline-offset-4 text-primary">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/* Terms and Privacy Link */}
            <div className="font-comfortaa text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking Reset Password, you agree to our <Link href="/termsOfService" className="underline underline-offset-4">Terms of Service</Link>{" "}
                and <Link href="/privacyPolicy" className="underline underline-offset-4">Privacy Policy</Link>.
            </div>
        </div>
    )
}
