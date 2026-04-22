"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Label } from "@/components/ui/label";
import { AtSign, CheckCircle2, XCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { cn } from "@/lib/utils"
import { createPublication } from '@/redux/create-publication-store/createPublicationSlice';
import { API_BASE_URL } from '@/lib/api-config';

const USERNAME_REGEX = /^[a-z0-9_]+$/;

export default function CreatePublicationsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [publicationUrl, setPublicationUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const currentUser = useAppSelector((state) => state.user);
    const [publicationUsername, setPublicationUsername] = useState("");
    const [publicationName, setPublicationName] = useState("");

    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [hasUsernameSpaces, setHasUsernameSpaces] = useState(false);
    const [hasSpecialChars, setHasSpecialChars] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Username Availability Checker
    const checkPublicationUsernameAvailability = useCallback(async (username: string) => {
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
            const response = await fetch(`${API_BASE_URL}/somaapp/check-publication-username/`, {
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



    // Function to submit publication domain and user id
    const handleSubmitDomain = async () => {
        setLoading(true);
        setError("");

        // Get JWT token from localStorage as fallback
        const jwtToken = localStorage.getItem('jwt_token');

        console.log("-----JWTToken: ", jwtToken);

        try {
            const response = await fetch(`${API_BASE_URL}/somaapp/publications/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${jwtToken}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    publication_owner_id: currentUser.id,
                    publication_owner_username: currentUser.username,
                    publication_username: publicationUsername,
                    publication_name: publicationName,
                    full_name: currentUser.fullName,
                    email: currentUser.email,
                    profile_picture: currentUser.profilePicture,
                    bio: currentUser.bio
                }),
            });

            console.log("-----------Response: ", response);
            if (!response.ok) {
                throw new Error("Failed to submit publication domain");
            }
            const data = await response.json();
            console.log("Created publication ID:", data.id);
            
            // Store publication id in Redux
            dispatch(createPublication({ field: 'publicationId', value: data.id }));
            // Optionally, handle response data
            router.push("./create-publication/import-email-list");
        } catch (err) {
            setError("Publication Username Already Exists. Try Another Username");
        } finally {
            setLoading(false);
        }
    };

    // Debounce effect for username checking
    useEffect(() => {
        const timer = setTimeout(() => {
            const lowercaseUsername = publicationUsername.toLowerCase();

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
                checkPublicationUsernameAvailability(lowercaseUsername);
            } else if (!isUsernameFocused && lowercaseUsername.trim() !== '') {
                setIsCheckingUsername(false);
            }
        }, 100); // 100ms debounce

        // Cleanup
        return () => clearTimeout(timer);
    }, [publicationUsername, checkPublicationUsernameAvailability, isUsernameFocused]);


    return (
        <div className="min-h-screen flex flex-col bg-muted font-playfair-display">
            {/* Header */}
            <header className="bg-transparent fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center px-6 py-4 gap-4">
                    <ChevronLeftIcon className="h-6 w-6 text-primary cursor-pointer" onClick={() => router.back()} />
                    <div className="text-3xl font-semibold text-secondary">SOMA</div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center mt-[1rem]">
                <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-2">Publication Username</h2>
                    <p className="text-gray-600 mb-6 text-center">Create Unique Publication Username Identifier</p>
                    
                    {/* Sign-Up Form Username Input */}
                    <div className="grid gap-3 w-full">

                        <div className="space-y-3">
                            <Label htmlFor="publicationName" className="flex justify-between items-center w-full">
                                <p className="text-sm">Publication Name</p>
                            </Label>
                            <Input
                                id="publicationName"
                                type="text"
                                placeholder="Enter Publication Name"
                                value={publicationName}
                                onChange={(e) => setPublicationName(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <Label htmlFor="username" className="flex justify-between items-center w-full">
                            <p className="text-sm">Publication Unique Username</p>
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
                                value={publicationUsername.toLowerCase()}
                                onChange={(e) => setPublicationUsername(e.target.value.toLowerCase())}
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
                                    <ClipLoader color="rgb(7, 7, 7)" size={15} />
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

                    {error && <p className="text-red-500 mt-2">{error}</p>}

                    <Button onClick={handleSubmitDomain} className="w-full mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer" disabled={loading || isUsernameAvailable === false || publicationUsername.trim().length < 1 || publicationName.trim().length < 1}>
                        {loading ? "Submitting..." : "Continue"}
                    </Button>

                    <Button onClick={() => router.push("./create-publication/choose-custom-domain")} className="w-full mt-2 bg-background text-primary hover:bg-background/10 border cursor-pointer">
                        Register Custom Domain
                    </Button>
                    <p className="text-gray-600 mt-2">You Can Change This Later</p>
                </div>
            </main>
        </div>
    );
}