"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createPublication } from "@/redux/create-publication-store/createPublicationSlice";

export default function PurchaseDomainPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const publicationDetails = useAppSelector((state) => state.createPublication);
    const currentUser = useAppSelector((state) => state.user);

    const subscriptionPlans = [
        {
            id: "basic",
            name: "Basic",
            price: "$9.99",
            period: "per month",
            description: "Perfect for getting started with your publication",
            features: [
                "Custom domain name",
                "Basic analytics",
                "Email support",
                "Customer Support",
                "10GB storage",
                "Up to 10,000 subscribers"
            ],
            popular: false
        },
        {
            id: "pro",
            name: "Professional",
            price: "$24.99",
            period: "per month",
            description: "Advanced features for growing publications",
            features: [
                "Everything in Basic",
                "Advanced analytics",
                "Priority Email Support",
                "Priority Customer Support",
                "25GB storage",
                "Up to 50,000 subscribers",
            ],
            popular: true
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: "$49.99",
            period: "per month",
            description: "Complete solution for large-scale publications",
            features: [
                "Everything in Professional",
                "Unlimited storage",
                "Unlimited subscribers",
                "Dedicated support",
                "Advanced security",
                "Custom integrations",
                "Custom Branding"
            ],
            popular: false
        }
    ];

    const handlePlanSelection = (planId: string) => {
        setSelectedPlan(planId);
    };


    // Function to submit publication domain and user id
    const handleSubmitDomain = async () => {
        setLoading(true);
        setError("");

        try {
            // Store publication name in Redux
            dispatch(createPublication({ field: 'selectedPublicationName', value: selectedPlan })); 

            // Optionally, handle response data
            if (selectedPlan === "basic") {
                router.push("./purchase-domain/pay-for-basic");
            }
            else if (selectedPlan === "pro") {
                router.push("./purchase-domain/pay-for-pro");
            }
            else {
                router.push("./purchase-domain/pay-for-enterprise");
            }
        } catch (err) {
            setError("Publication Username Already Exists. Try Another Username");
        } finally {
            setLoading(false);
        }
    };

    console.log("------------------domain :", publicationDetails);

    console.log("Selected Plan: ", selectedPlan);

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
            <main className="flex flex-1 items-start justify-center mt-[1rem] px-4 py-8">
                <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-4xl">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">Choose Your Subscription Plan</h2>
                        <p className="text-gray-600 text-center">Select the perfect plan for your publication needs for <span className="font-bold text-primary">{publicationDetails.selectedPublicationDomain}</span></p>
                    </div>
                    
                    {/* Subscription Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subscriptionPlans.map((plan) => (
                            <Card 
                                key={plan.id}
                                className={cn(
                                    "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                                    selectedPlan === plan.id && "ring-2 ring-secondary ring-offset-2",
                                    plan.popular && "border-secondary"
                                )}
                                onClick={() => handlePlanSelection(plan.id)}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-secondary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            Most Popular
                                        </div>
                                    </div>
                                )}
                                
                                <CardHeader className="text-center pb-3">
                                    <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-2xl font-bold">{plan.price}</span>
                                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                                </CardHeader>
                                
                                <CardContent className="flex-1">
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                
                                <CardFooter>
                                    <Button 
                                        className={cn(
                                            "w-full",
                                            selectedPlan === plan.id 
                                                ? "bg-secondary text-primary-foreground" 
                                                : "bg-background text-primary hover:bg-secondary/90"
                                        )}
                                        variant={selectedPlan === plan.id ? "outline" : "outline"}
                                    >
                                        {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Continue Button */}
                    <div className="mt-8 text-center">
                        <Button 
                            onClick={handleSubmitDomain}
                            className="w-full max-w-md bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
                            disabled={!selectedPlan}
                        >
                            Continue with {selectedPlan ? subscriptionPlans.find(p => p.id === selectedPlan)?.name : "Plan"}
                        </Button>
                        
                        <p className="text-gray-600 mt-4 text-sm">
                            You can upgrade or downgrade your plan at any time
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
