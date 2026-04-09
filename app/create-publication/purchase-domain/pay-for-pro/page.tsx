"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

export default function PayForProPage() {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const publicationDetails = useAppSelector((state) => state.createPublication);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            if (cardNumber && expiry && cvc && name) {
                setSuccess(true);
            } else {
                setError("Please fill in all card details.");
            }
            setIsLoading(false);
        }, 1200);
    };

    console.log("Publication Details: ", publicationDetails);

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted font-playfair-display py-8">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Pay for Pro Subscription</CardTitle>
                    <CardDescription>
                        Unlock Basic for <span className="font-bold text-primary">$24.99/month</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="name">Name on Card</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoComplete="cc-name"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                                id="cardNumber"
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ""))}
                                required
                                maxLength={19}
                                autoComplete="cc-number"
                                className="mt-1"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Label htmlFor="expiry">Expiry</Label>
                                <Input
                                    id="expiry"
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, ""))}
                                    required
                                    maxLength={5}
                                    autoComplete="cc-exp"
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input
                                    id="cvc"
                                    type="text"
                                    placeholder="123"
                                    value={cvc}
                                    onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                                    required
                                    maxLength={4}
                                    autoComplete="cc-csc"
                                    className="mt-1"
                                />
                            </div>
                        </div>


                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        
                        {success && <div className="text-green-600 text-sm text-center">Payment successful! Welcome to Pro.</div>}
                        <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={isLoading}>
                            {isLoading ? "Processing..." : "Confirm"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
