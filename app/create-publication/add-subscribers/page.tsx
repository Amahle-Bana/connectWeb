"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Image, Upload } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { API_BASE_URL } from '@/lib/api-config';

export default function AddSubscribersPage() {
    const router = useRouter();
    const publicationId = useAppSelector(state => state.createPublication.publicationId);
    const [subscribers, setSubscribers] = useState([
        { email: '', fullName: '', phoneNumber: '' },
        { email: '', fullName: '', phoneNumber: '' },
        { email: '', fullName: '', phoneNumber: '' },
        { email: '', fullName: '', phoneNumber: '' },
        { email: '', fullName: '', phoneNumber: '' },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^\d+$/.test(phone);
    };

    const handleInputChange = (idx: number, field: 'email' | 'fullName' | 'phoneNumber', value: string) => {
        setSubscribers(prev => {
            const updated = [...prev];
            updated[idx][field] = value;
            return updated;
        });

        // Show error if the value is non-empty and invalid
        if (field === 'email' && value && !validateEmail(value)) {
            setError(`Subscriber ${idx + 1}: Invalid email address`);
            return;
        }
        if (field === 'phoneNumber' && value && !validatePhone(value)) {
            setError(`Subscriber ${idx + 1}: Phone number must contain only numbers`);
            return;
        }
        setError("");
    };

    const handleSubmitSubscribers = async () => {
        for (let i = 0; i < subscribers.length; i++) {
            const sub = subscribers[i];
            if (sub.email && !validateEmail(sub.email)) {
                setError(`Subscriber ${i + 1}: Invalid email address`);
                return;
            }
            if (sub.phoneNumber && !validatePhone(sub.phoneNumber)) {
                setError(`Subscriber ${i + 1}: Phone number must contain only numbers`);
                return;
            }
        }
        setLoading(true);
        setError('');
        try {
            const jwtToken = localStorage.getItem('jwt_token');
            for (const sub of subscribers) {
                if (sub.email && sub.fullName && sub.phoneNumber) {
                    const response = await fetch(`${API_BASE_URL}/somaapp/add-subscriber-to-csv/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${jwtToken}`,
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            publication_id: publicationId,
                            email: sub.email,
                            full_name: sub.fullName,
                            phone_number: sub.phoneNumber,
                        }),
                    });
                    if (!response.ok) throw new Error('Failed to add subscriber');
                }
            }
            router.push('./publication-category/');
        } catch (err) {
            setError('Failed to add subscribers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    <h2 className="text-2xl font-bold mb-2">Add Subscribers</h2>
                    <p className="text-gray-600 mb-6 text-center">Add Family And Friends To Your E-mail List To Help You Get Started</p>
                    <div className="w-full mb-2 relative space-y-2">
                        {subscribers.map((sub, idx) => (
                            <div key={idx} className="mb-4">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Subscriber {idx + 1}
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={sub.email}
                                    onChange={e => handleInputChange(idx, 'email', e.target.value)}
                                    className="pr-24 text-2xl mb-1"
                                />
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    value={sub.fullName}
                                    onChange={e => handleInputChange(idx, 'fullName', e.target.value)}
                                    className="pr-24 text-2xl mb-1"
                                />
                                <Input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={sub.phoneNumber}
                                    onChange={e => handleInputChange(idx, 'phoneNumber', e.target.value)}
                                    className="pr-24 text-2xl"
                                />
                            </div>
                        ))}
                    </div>

                    {error && <div className="text-red-500 text-xs mt-2">{error}</div>}


                    <Button className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer" onClick={handleSubmitSubscribers} disabled={loading}>
                        {loading ? 'Submitting...' : 'Continue'}
                    </Button>
                    
                    <Button onClick={() => router.push('./publication-category/')} className="w-full mt-2 bg-background border text-primary hover:bg-background/70 cursor-pointer">
                        Skip
                    </Button>
                    <p className="text-gray-600 mt-2">{"They Won't Get Notified You Add Them To Your E-mail List"}</p>
                </div>
            </main>
        </div>
    );
}