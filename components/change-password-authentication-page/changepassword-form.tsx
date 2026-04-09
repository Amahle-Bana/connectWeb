import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ClipLoader } from "react-spinners"
import { EyeOff, Eye } from "lucide-react"
import { useTheme } from "next-themes";



// Change Password Form Component
export function ChangePasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    // useState Variables
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // useRouter Hook
    const router = useRouter();

    // useSearchParams Hook
    const searchParams = useSearchParams();

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

        // Set loading state to true at the start
        setIsLoading(true)

        // Checking if the passwords match
        if (password !== confirmPassword) {
            // Setting the error
            setError("Passwords do not match")
            setIsLoading(false)
            return
        }

        // Getting the reset token from URL
        const token = searchParams.get('token')
        if (!token) {
            // Setting the error
            setError("Reset token not found")
            setIsLoading(false)
            return
        }

        // Fetching the reset password confirmation
        fetch(`${process.env.NEXT_PUBLIC_CHANGE_PASSWORD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                new_password: password
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    // Setting the message
                    setMessage(data.message)

                    // Redirecting to the login page after a short delay
                    setTimeout(() => {
                        router.push('/authentication')
                    }, 2000)
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


    // useEffect Hook
    useEffect(() => {

        // Checking if we have a reset token in URL
        const token = searchParams.get('token')
        if (!token) {

            // Redirecting to the reset password page
            router.push('/authentication/resetpassword')
        }
    }, [router, searchParams])



    // Returning the Change Password Form
    return (
        // Change Password Form Container
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {/* Change Password Form Card */}
            <Card className="bg-background border rounded-3xl font-comfortaa">
                {/* Change Password Form Card Header */}
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
                    <CardTitle className="text-xl text-primary font-bold">Change Password</CardTitle>
                    <CardDescription className="text-primary">
                        Enter your new password
                    </CardDescription>
                </CardHeader>
                {/* Change Password Form Card Content */}
                <CardContent>
                    {/* Change Password Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            {/* Change Password Form New Password Label And Input */}
                            <div className="grid gap-1 relative">
                                <Label htmlFor="password" className="text-sm font-bold text-primary">New Password</Label>
                                <Input
                                    id="password"
                                    type="text"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    className="pr-10 text-black rounded-full placeholder:text-black [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                    style={{
                                        WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                        msTextSecurity: showPassword ? 'none' : 'disc'
                                    } as React.CSSProperties}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2/3 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-primary" />
                                    )}
                                </button>
                            </div>
                            {/* Change Password Form Confirm Password Label And Input */}
                            <div className="grid gap-1 relative">
                                <Label htmlFor="confirmPassword" className="text-sm font-bold text-primary">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="text"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    className="pr-10 text-black rounded-full placeholder:text-black [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                    style={{
                                        WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                        msTextSecurity: showPassword ? 'none' : 'disc'
                                    } as React.CSSProperties}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2/3 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-primary" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-primary" />
                                    )}
                                </button>
                            </div>
                            {/* Change Password Form Message */}
                            {message && (
                                <div className="text-sm text-green-500 text-center">
                                    {message}
                                </div>
                            )}
                            {/* Change Password Form Error */}
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            {/* Change Password Form Submit Button */}
                            <Button
                                type="submit"
                                className="hover:bg-secondary/90 w-full bg-secondary text-secondary-foreground cursor-pointer rounded-full"
                                disabled={isLoading}
                                size="lg"
                            >
                                Change Password
                                {isLoading ? <ClipLoader color="#fff" size={20} /> : ''}
                            </Button>
                            {/* Change Password Form Signup Link */}
                            <div className="text-center text-sm text-primary">
                                Don&apos;t have an account?{" "}
                                <Link href="/authentication/signup" className="underline underline-offset-4 text-primary">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/* Change Password Form Terms and Privacy Link */}
            <div className="font-comfortaa text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking Change Password, you agree to our <Link href="/termsOfService" className="underline underline-offset-4">Terms of Service</Link>{" "}
                and <Link href="/privacyPolicy" className="underline underline-offset-4">Privacy Policy</Link>.
            </div>
        </div>
    )
}