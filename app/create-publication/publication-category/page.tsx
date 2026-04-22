"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Image, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { updateUserField } from '@/redux/user-store/userSlice';
import { RootState } from '@/redux'; // adjust import as needed
import { API_BASE_URL } from '@/lib/api-config';


interface PublicationApiRow {
    id: number;
    csv_file?: string;
}

const preferences = [
    "Family", "Health", "Relationships", "Sexuality", "Home", "Food", "Pets", "Mental Health",
    "Productivity", "Mindfulness", "Business", "Marketing", "Leadership", "Work",
    "Artificial Intelligence", "Blockchain", "Data Science", "Gadgets", "Makers",
    "Security", "Technology", "Design", "Project Management", "Programming",
    "Dev Ops", "Operating Systems", "Writing", "Art", "Gaming", "Humor",
    "Movies", "Music", "News", "Photography", "Podcasts", "Television",
    "Economics", "Education", "Equality", "Finance", "Law", "Transportation",
    "Politics", "Race", "Science", "Mathematics", "Drugs", "Philosophy",
    "Religion", "Spirituality", "Cultural Studies", "Fashion", "Beauty",
    "Language", "Sports", "Cities", "Nature", "Travel"
];

export default function PublicationsCategoryPage() {
    const [publicationUrl, setPublicationUrl] = useState("");
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const publicationId = useSelector((state: RootState) => state.createPublication.publicationId);

    // Handle Preference Change
    const handlePreferenceChange = (preference: string) => {
        setSelectedPreferences(prev => {
            if (prev.includes(preference)) {
                return prev.filter(p => p !== preference);
            } else {
                return [...prev, preference];
            }
        });
    };

    // Handle Submit
    const handlePublicationCategoriesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedPreferences.length === 0 || selectedPreferences.length > 3) {
            setError('Please select up to 3 categories.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const jwtToken = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/somaapp/update-publication-category/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {})
                },
                credentials: 'include',
                body: JSON.stringify({
                    publication_id: publicationId,
                    categories: selectedPreferences
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update publication categories');
            }

            // Success: redirect or show message
            router.push('./success');
        } catch (error) {
            setError('Failed to save categories. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };



// ////////////////////   LOGGING CSV FILE TO SEE RESULTS (TEMPORARY CODE) //////////////////////////////////////////////
    const fetchAndLogCSV = async () => {
        if (!publicationId) return;
        try {
            const jwtToken = localStorage.getItem('jwt_token');
            const response = await fetch(`${API_BASE_URL}/somaapp/publications/`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch publication data");
            const publications = (await response.json()) as PublicationApiRow[];
            const publication = publications.find((pub) => pub.id === publicationId);
            if (publication && publication.csv_file) {
                // Decode base64
                const decoded = atob(publication.csv_file);
                // Parse CSV
                const rows = decoded.split('\n').filter(Boolean).map(row => row.split(','));
                const headers = rows[0];
                const data = rows.slice(1).map(row => {
                    const obj: Record<string, string> = {};
                    headers.forEach((header: string, idx: number) => {
                        obj[header.trim()] = row[idx]?.trim() ?? "";
                    });
                    return obj;
                });
                console.log("CSV Structured Data:", data);
            } else {
                console.log("No CSV file found for this publication.");
            }
        } catch (err) {
            console.error("Failed to load CSV file.", err);
        }
    };

    useEffect(() => {
        const fetchAndLogRawCSV = async () => {
            if (!publicationId) return;
            try {
                const jwtToken = localStorage.getItem('jwt_token');
                const response = await fetch(`${API_BASE_URL}/somaapp/publications/`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch publication data");
                const publications = (await response.json()) as PublicationApiRow[];
                const publication = publications.find((pub) => pub.id === publicationId);
                if (publication && publication.csv_file) {
                    // Decode base64
                    const decoded = atob(publication.csv_file);
                    console.log("Raw CSV Content:\n", decoded);
                } else {
                    console.log("No CSV file found for this publication.");
                }
            } catch (err) {
                console.error("Failed to load CSV file.", err);
            }
        };
        fetchAndLogRawCSV();
    }, [publicationId]);

// ////////////////////   LOGGING CSV FILE TO SEE RESULTS (TEMPORARY CODE) //////////////////////////////////////////////

    return (
        <div className="min-h-screen flex flex-col bg-muted font-playfair-display">

            {/* Main Content */}
            <main className="min-h-screen w-full p-4 md:p-6">
                {/* Card for Selecting Preferences */}
                <Card className="h-[calc(100vh-2rem)] flex flex-col">

                    {/* Card Header */}
                    <CardHeader className="flex flex-col justify-center items-center">
                        <CardTitle className="text-center font-playfair-display text-2xl md:text-3xl">{"Select Your Publication's Category"}</CardTitle>
                        <CardDescription className="text-center font-playfair-display text-sm md:text-base">
                            {"This Will Be Your Publication's Category (Select 3 Maximum Categories)"}
                        </CardDescription>
                    </CardHeader>

                    {/* Card Content */}
                    <CardContent className="flex-1 overflow-y-auto ">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {preferences.map((preference) => (
                                <div
                                    key={preference}
                                    onClick={() => handlePreferenceChange(preference)}
                                    className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${selectedPreferences.includes(preference)
                                        ? 'bg-secondary text-secondary-foreground'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    <span className="text-sm font-medium font-playfair-display">
                                        {preference}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    {/* Card Footer */}
                    <CardFooter className="flex flex-col justify-between p-4 border-t">

                        <div className="flex flex-col items-center justify-center w-full h-full">
                            {/* Error Message */}
                            {error && <p className="text-red-500 mt-4">{error}</p>}
                        </div>

                        <div className="flex flex-row items-center justify-between w-full">
                            {/* Back Button */}
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="font-playfair-display cursor-pointer"
                            >
                                Back
                            </Button>

                            {/* Submit Button */}
                            <Button
                                className="bg-secondary text-white hover:bg-secondary/90 min-w-[100px] font-playfair-display cursor-pointer"
                                // onClick={handleSubmit}
                                onClick={handlePublicationCategoriesSubmit}
                                disabled={isLoading || selectedPreferences.length > 3}
                            >
                                Submit
                                {isLoading ? (
                                    <ClipLoader
                                        color="#ffffff"
                                        size={20}
                                        className="my-1"
                                    />
                                ) : (
                                    ''
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

            </main>
        </div>
    );
}