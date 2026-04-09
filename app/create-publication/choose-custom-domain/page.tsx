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
import { IconWorld } from '@tabler/icons-react'

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



    // Username Availability Checker
    const checkPublicationDomainAvailability = useCallback(async (username: string) => {
        const lowercaseUsername = username.toLowerCase();

        if (lowercaseUsername.includes(' ')) {
            setHasUsernameSpaces(true);
            setIsUsernameAvailable(null);
            setIsCheckingUsername(false);
            setError("No spaces allowed in domain name.");
            return;
        } else {
            setHasUsernameSpaces(false);
        }

        if (lowercaseUsername === '') {
            setIsUsernameAvailable(null);
            setIsCheckingUsername(false);
            setHasUsernameSpaces(false);
            setError("");
            return;
        }

        setIsCheckingUsername(true);

        try {
            const response = await fetch("http://localhost:8000/somaapp/check-publication-domain-availability/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ domain: lowercaseUsername }),
            });
            const data = await response.json();
            console.log("----------------The Data: ", data);
            console.log("-------------The Value: ", lowercaseUsername);
            if (response.ok && typeof data.available === 'boolean') {
                setIsUsernameAvailable(data.available);
                setError(data.available ? "" : "Domain is not available.");
            } else {
                setIsUsernameAvailable(null);
                setError(data.error || "Unexpected response from backend.");
            }
        } catch (error) {
            console.error('Error checking domain:', error);
            setIsUsernameAvailable(null);
            setError("Error checking domain availability.");
        } finally {
            setIsCheckingUsername(false);
        }
    }, []);



    // Function to submit publication domain and user id
    const handleSubmitDomain = async () => {
        setLoading(true);
        setError("");

        try {
            // Store publication name in Redux
            dispatch(createPublication({ field: 'selectedPublicationName', value: publicationName }));
            // Store custom domain name in Redux
            dispatch(createPublication({ field: 'selectedPublicationDomain', value: publicationUsername }));
            // Optionally, handle response data
            router.push("./purchase-domain");
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
                setError("");
                return;
            }

            if (lowercaseUsername.includes(' ')) {
                setHasUsernameSpaces(true);
                setIsUsernameAvailable(null);
                setIsCheckingUsername(false);
                setError("No spaces allowed in domain name.");
                return;
            }

            if (lowercaseUsername && isUsernameFocused) {
                checkPublicationDomainAvailability(lowercaseUsername);
            } else if (!isUsernameFocused && lowercaseUsername.trim() !== '') {
                setIsCheckingUsername(false);
            }
        }, 1000); // 5 seconds debounce

        // Cleanup
        return () => clearTimeout(timer);
    }, [publicationUsername, checkPublicationDomainAvailability, isUsernameFocused]);


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
                    <h2 className="text-2xl font-bold mb-2">Custom Publication</h2>
                    <p className="text-gray-600 mb-6 text-center">Choose Custom Domain & Create Publication Name</p>

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
                            <p className="text-sm">Custom Domain</p>
                            {hasUsernameSpaces ?
                                <p className="text-red-500 text-xs">No spaces allowed</p>
                                : isUsernameAvailable === true ?
                                    <p className="text-green-500 text-xs">Username Is Available</p>
                                    : isUsernameAvailable === false ?
                                        <p className="text-red-500 text-xs">Username Already Exists</p>
                                        : null}
                        </Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 border-r-2 border-border pr-2">
                                <IconWorld className="h-4 w-4 text-muted-foreground" />
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
                                    (hasUsernameSpaces) && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px]",
                                    isUsernameAvailable === true && !hasUsernameSpaces  && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500 focus-visible:ring-[3px]",
                                    isUsernameAvailable === false && !hasUsernameSpaces && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-[3px]"
                                )}
                                style={{ paddingLeft: '3rem' }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isCheckingUsername ? (
                                    <ClipLoader color="rgb(7, 7, 7)" size={15} />
                                ) : (hasUsernameSpaces) ? (
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

                    <Button
                        onClick={handleSubmitDomain}
                        className="w-full mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
                        disabled={
                            loading ||
                            !isUsernameAvailable ||
                            publicationName.trim().length < 1
                        }
                    >
                        {loading ? "Submitting..." : "Continue"}
                    </Button>

                    <Button onClick={() => router.back()} className="w-full mt-2 bg-background text-primary hover:bg-background/10 border cursor-pointer">
                        Back
                    </Button>
                    <p className="text-gray-600 mt-2">You Can Change This Later</p>
                </div>
            </main>
        </div>
    );
}