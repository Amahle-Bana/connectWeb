import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SyntheticEvent, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ClipLoader } from 'react-spinners';
import { CheckCircle2, XCircle, AtSign, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const USERNAME_REGEX = /^[a-z0-9_]+$/;

// Sign-Up Form
export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    // State Variables
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [hasUsernameSpaces, setHasUsernameSpaces] = useState(false);
    const [hasSpecialChars, setHasSpecialChars] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [structure, setStructure] = useState("");

    // Router and Auth Context
    const router = useRouter();

    // Auth Context
    const { signup, checkExistingUserData } = useAuth();

    // Theme support
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Username Availability Checker
    const checkUsernameAvailability = useCallback(async (username: string) => {
        // Convert username to lowercase
        const lowercaseUsername = username.toLowerCase();

        // Check for spaces in username
        if (lowercaseUsername.includes(' ')) {
            setHasUsernameSpaces(true);
            setHasSpecialChars(false);
            setIsUsernameAvailable(null);
            setIsCheckingUsername(false);
            return;
        } else {
            setHasUsernameSpaces(false);
        }

        // Check for special characters
        if (!USERNAME_REGEX.test(lowercaseUsername)) {
            setHasSpecialChars(true);
            setIsUsernameAvailable(null);
            setIsCheckingUsername(false);
            return;
        } else {
            setHasSpecialChars(false);
        }

        // Username Empty Validation
        if (lowercaseUsername === '') {
            setIsUsernameAvailable(null);
            setIsCheckingUsername(false);
            setHasUsernameSpaces(false);
            setHasSpecialChars(false);
            return;
        }

        // Set the checking username to true
        setIsCheckingUsername(true);

        // Check Username Availability
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CHECK_USERNAME_AVAILABILITY}`, {
                // POST Request
                method: 'POST',
                // JSON Request Type
                headers: { 'Content-Type': 'application/json' },
                // JSON Body
                body: JSON.stringify({ username: lowercaseUsername }),
            });

            // JSON Response
            const data = await response.json();

            // Set the username availability
            setIsUsernameAvailable(data.available);
        } catch (error) {
            // Set the error message
            console.error('Error checking username:', error);
            // Set the username availability to null
            setIsUsernameAvailable(null);
        } finally {
            // Set the checking username to false
            setIsCheckingUsername(false);
        }
    }, []);

    // Sign-Up Form Submit Handler
    const handleSignUpSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        // Set the loading to true
        setIsLoading(true);
        // Set the error message to empty
        setErrorMessage("");

        const trimmedFullName = fullName.trim();
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const lowercaseUsername = trimmedUsername.toLowerCase();

        // Full Name Validation
        if (trimmedFullName === '') {
            setErrorMessage('Please enter your full name');
            setIsLoading(false);
            return;
        }

        // Full Name length validation
        if (trimmedFullName.length < 2) {
            setErrorMessage('Full name must be at least 2 characters long');
            setIsLoading(false);
            return;
        }

        // @ Email Validation
        if (!trimmedEmail.includes('@gmail.com')) {
            setErrorMessage('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        // Email Length Validation
        if (trimmedEmail.length < 4) {
            setErrorMessage('Email must be at least 4 characters long');
            setIsLoading(true);
            if (trimmedEmail.includes('@gmail.com')) {
                setIsEmailValid(true);
                setIsLoading(false);
            } else {
                setIsEmailValid(false);
                setIsLoading(false);
            }
            return;
        }

        // Empty Email Validation
        if (trimmedEmail === '') {
            setErrorMessage('Fill In Your Email');
            setIsLoading(false);
            return;
        }

        // Password length validation
        if (trimmedPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        // Empty Password Validation
        if (trimmedPassword === '') {
            setErrorMessage('Fill In Your Password');
            setIsLoading(false);
            return;
        }

        // Campus Structure Validation
        if (structure === '') {
            setErrorMessage('Please select your campus');
            setIsLoading(false);
            return;
        }

        // Check for existing user data first
        checkExistingUserData(lowercaseUsername, trimmedEmail)
            .then(checkResult => {
                if (!checkResult.success) {
                    setErrorMessage(checkResult.message);
                    setIsLoading(false);
                    return;
                }

                // If no existing data found, proceed with signup
                return signup(lowercaseUsername, trimmedEmail, trimmedPassword, trimmedFullName, structure);
            })
            .then(result => {
                if (result && result.success) {
                    // Redirect to OTP verification page with email parameter
                    router.push(`/authentication/otp?email=${encodeURIComponent(trimmedEmail)}`);
                } else if (result) {
                    setErrorMessage(result.message);
                }
            })
            .catch(error => {
                // Set the error message
                setErrorMessage('An error occurred during sign up');
            })
            .finally(() => {
                // Set the loading to false
                setIsLoading(false);
            });
    };



    // Debounce effect for username checking
    useEffect(() => {
        const timer = setTimeout(() => {
            const lowercaseUsername = username.toLowerCase();

            if (lowercaseUsername.trim() === '') {
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                setHasUsernameSpaces(false);
                setHasSpecialChars(false);
                return;
            }

            if (lowercaseUsername.includes(' ')) {
                setHasUsernameSpaces(true);
                setHasSpecialChars(false);
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                return;
            }

            if (!USERNAME_REGEX.test(lowercaseUsername)) {
                setHasSpecialChars(true);
                setHasUsernameSpaces(false);
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                return;
            }

        }, 100); // 100ms debounce

        // Cleanup
        return () => clearTimeout(timer);
    }, [username]);


    // Debounce effect for username checking
    useEffect(() => {
        const timer = setTimeout(() => {
            const lowercaseUsername = username.toLowerCase();

            if (lowercaseUsername.trim() === '') {
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                setHasUsernameSpaces(false);
                setHasSpecialChars(false);
                return;
            }

            if (lowercaseUsername.includes(' ')) {
                setHasUsernameSpaces(true);
                setHasSpecialChars(false);
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                return;
            }

            if (!USERNAME_REGEX.test(lowercaseUsername)) {
                setHasSpecialChars(true);
                setHasUsernameSpaces(false);
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                return;
            }

            if (lowercaseUsername && isUsernameFocused) {
                checkUsernameAvailability(lowercaseUsername);
            } else if (!isUsernameFocused && lowercaseUsername.trim() !== '') {
                setIsCheckingUsername(false);
            }
        }, 100); // 100ms debounce

        // Cleanup
        return () => clearTimeout(timer);
    }, [username, checkUsernameAvailability, isUsernameFocused]);


    // Email Validation Effect
    useEffect(() => {
        if (email === '') {
            setIsEmailValid(null);
            return;
        }
        setIsEmailValid(email.includes('@gmail.com'));
    }, [email]);



    // Sign-Up Form
    return (

        // Sign-Up Form Container
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="bg-background border rounded-3xl font-comfortaa">
                {/* Sign-Up Form Header */}
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
                    <CardDescription className="text-primary">
                        Sign Up With Your Student Email
                    </CardDescription>
                </CardHeader>
                {/* Sign-Up Form Content */}
                <CardContent>
                    <form onSubmit={handleSignUpSubmit}>
                        <div className="grid gap-2">
                            {/* Sign-Up Form Inputs */}
                            <div className="grid gap-1">

                                {/* Sign-Up Form Full Name Input */}
                                <div className="grid gap-1">
                                    <Label htmlFor="fullName" className="text-sm font-bold text-primary">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="text-primary rounded-full placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Sign-Up Form Username Input */}
                                <div className="grid gap-1">

                                    <Label htmlFor="username" className="flex justify-between items-center w-full">
                                        <p className="text-sm">Username</p>
                                        {hasUsernameSpaces ?
                                            <p className="text-red-500 text-xs">No spaces allowed</p>
                                            : hasSpecialChars ?
                                                <p className="text-red-500 text-xs">Only letters, numbers, and underscores allowed</p>
                                                : isUsernameAvailable === true ?
                                                    <p className="text-green-500 text-xs">Username Is Available</p>
                                                    : isUsernameAvailable === false ?
                                                        <p className="text-red-500 text-xs">Username Already Exists</p>
                                                        : null}
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 border-r-2 border-border pr-2">
                                            <AtSign className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Choose Your Unique Handle"
                                            required
                                            value={username.toLowerCase()}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                            onFocus={() => setIsUsernameFocused(true)}
                                            onBlur={() => setIsUsernameFocused(false)}
                                            className={cn(
                                                (hasUsernameSpaces || hasSpecialChars) && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px]",
                                                isUsernameAvailable === true && !hasUsernameSpaces && !hasSpecialChars && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500 focus-visible:ring-[3px]",
                                                isUsernameAvailable === false && !hasUsernameSpaces && !hasSpecialChars && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px]"
                                            )}
                                            style={{ paddingLeft: '3rem' }}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isCheckingUsername ? (
                                                <ClipLoader color="rgb(37, 99, 235)" size={15} />
                                            ) : (hasUsernameSpaces || hasSpecialChars) ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : isUsernameAvailable === true ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : isUsernameAvailable === false ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* Sign-Up Form Email Input */}
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
                                            placeholder="studentnumber@ufh.ac.za"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={cn(
                                                isEmailValid === true && "rounded-full border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500 focus-visible:ring-[3px] text-primary placeholder:text-black",
                                                isEmailValid === false && "rounded-full border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px] text-primary placeholder:text-black",
                                                "pr-10 text-primary rounded-full placeholder:text-gray-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                            )}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isEmailValid === true ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : isEmailValid === false ? (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                {/* Sign-Up Form Password Input */}
                                <div className="grid gap-1">
                                    <div className="flex items-center">
                                        <Label className="text-sm font-bold text-primary" htmlFor="password">Password</Label>
                                        <Link
                                            href="/authentication/resetpassword"
                                            className="ml-auto text-sm underline text-primary underline-offset-4"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <div className="relative">
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
                                            className="pr-10 text-primary rounded-full placeholder:text-black [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:appearance-none"
                                            style={{
                                                WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                                msTextSecurity: showPassword ? 'none' : 'disc'
                                            } as React.CSSProperties}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-primary" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="structure" className="text-sm font-bold text-primary">Campus</Label>
                                    <Select
                                        value={structure}
                                        onValueChange={(value) => setStructure(value)}
                                    >
                                        <SelectTrigger className="w-full h-10 rounded-full border-input bg-background text-primary placeholder:text-gray-500 focus-visible:ring-[3px] focus-visible:ring-ring/50 px-4">
                                            <SelectValue placeholder="Select Campus" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background border rounded-md">
                                            <SelectItem value="Alice SRC" className="text-primary focus:bg-accent focus:text-accent-foreground">Alice Campus</SelectItem>
                                            <SelectItem value="East London SRC" className="text-primary focus:bg-accent focus:text-accent-foreground">East London Campus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Sign-Up Error Message */}
                                <div className="text-red-500 text-sm text-center">
                                    {errorMessage}
                                </div>
                                {/* Sign-Up Form Submit Button */}
                                <Button type="submit"
                                    className="hover:bg-secondary/90 w-full bg-secondary text-secondary-foreground cursor-pointer rounded-full"
                                    disabled={isLoading}
                                    size="lg"
                                >
                                    Sign-Up
                                    {isLoading ? <ClipLoader color="#fff" size={20} /> : ''}
                                </Button>
                            </div>
                            {/* Sign-Up Form Login Link */}
                            <div className="text-center text-sm text-primary">
                                Do you have an account?{" "}
                                <Link href="/authentication" className="underline underline-offset-4 text-primary">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            {/* Sign-Up Form Terms and Privacy Link */}
            <div className="font-comfortaa text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking Sign-Up, you agree to our <Link href="/privacyPolicy" className="underline underline-offset-4">Privacy Policy</Link>{" "}
                and <Link href="/termsOfService" className="underline underline-offset-4">Terms of Service</Link>.
            </div>
        </div>
    )
}