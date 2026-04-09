"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck } from 'lucide-react';

export default function SuccessPage() {
    const router = useRouter();
    const [publicationUrl, setPublicationUrl] = useState("");

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
                    <h2 className="text-4xl font-bold mb-2 text-secondary">DONE!</h2>
                    <CheckCheck className="w-20 h-20 text-secondary" />
                    <p className="text-gray-600 mt-2">Done! Press Contiue To Go To Publication</p>
                    <Button onClick={() => router.push("/my-publication")} className="w-full mt-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer">
                        Continue
                    </Button>
                </div>
            </main>
        </div>
    );
}