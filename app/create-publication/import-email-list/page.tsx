"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Image, Upload } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { API_BASE_URL } from '@/lib/api-config';

export default function ImportEmailListPage() {
    const router = useRouter();
    const [publicationUrl, setPublicationUrl] = useState("");
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const publicationId = useAppSelector(state => state.createPublication.publicationId);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const allCsv = files.every(file =>
                file.name.toLowerCase().endsWith('.csv') ||
                file.type === 'text/csv'
            );
            if (!allCsv) {
                setError("Only CSV Files are allowed");
                setUploadedFiles([]);
                return;
            }
            setError("");
            setUploadedFiles(files);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            const allCsv = files.every(file =>
                file.name.toLowerCase().endsWith('.csv') ||
                file.type === 'text/csv'
            );
            if (!allCsv) {
                setError("Only CSV Files are allowed");
                setUploadedFiles([]);
                return;
            }
            setError("");
            setUploadedFiles(files);
        }
    };

    console.log("--------------publicationId: ", publicationId);

    const handleSubmitFile = async () => {
        if (uploadedFiles.length === 0) return;
        if (!publicationId) {
            setError("Publication ID is required. Please try again.");
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const jwtToken = localStorage.getItem('jwt_token');
            const formData = new FormData();
            formData.append('csv_file', uploadedFiles[0]);
            formData.append("publication_id", String(publicationId));
            const response = await fetch(`${API_BASE_URL}/somaapp/upload-publication-csv/`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
                credentials: "include",
                body: formData,
            });

            console.log("----------response: ", response);

            if(response.ok) {
                const responseData = await response.json();
                setSuccess("CSV processed successfully with AI! Redirecting...");
                setTimeout(() => {
                    router.push("./publication-category");
                }, 2000);
            }
            if (!response.ok) {
                throw new Error("Failed to upload file");
            }
        } catch (err) {
            setError("Failed to upload file. Please try again.");
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
                    <h2 className="text-2xl font-bold mb-2">Import Your E-mail List</h2>
                    
                    <p className="text-gray-600 mb-6 text-center">{"Don't Have An E-mail List? Don't Worry, We Will Help You Build It?"}</p>

                    <div
                        className={`flex flex-col justify-center items-center rounded-lg border-2 border-dashed h-70 w-95 bg-background/60 transition-colors duration-200 ${isDragActive ? 'border-2 border-dashed border-secondary bg-primary/5' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-row">
                            <Upload className="w-12 h-12 text-gray-400 mb-1 " />
                        </div>
                        <span className="text-xs text-gray-500 font-playfair-display mt-2">
                            Drag And Drop Your E-mail List Here
                        </span>
                        <Button className="mt-2 bg-secondary hover:bg-secondary/90 cursor-pointer" onClick={handleUploadClick}>
                            Upload
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            multiple
                            accept=".csv"
                        />
                        {uploadedFiles.length > 0 && (
                            <div className="mt-4 w-full flex flex-col items-center">
                                {uploadedFiles.map((file, idx) => (
                                    <div key={idx} className="text-xs text-gray-700 font-playfair-display mt-1">
                                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
                    {success && <div className="text-green-500 text-xs mt-2">{success}</div>}

                    {/* Submit File Button */}
                    <Button
                        className="w-full mt-4 bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                        onClick={handleSubmitFile}
                        disabled={uploadedFiles.length === 0 || loading}
                    >
                        {loading ? "Processing with AI..." : "Submit File"}
                    </Button>

                    <Button onClick={() => router.push("./add-subscribers")} className="w-full mt-4 bg-background border text-primary hover:bg-background/70 cursor-pointer">
                        Skip
                    </Button>

                    <p className="text-gray-600 mt-2">You Can Change This Later</p>
                </div>
            </main>
        </div>
    );
}