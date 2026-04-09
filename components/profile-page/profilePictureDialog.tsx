"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useAppDispatch } from '@/redux/hooks';
import { updateUserField } from '@/redux/user-store/userSlice';

interface ArticleImageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setImagePreview: (preview: string | null) => void;
}

const ArticleImageDialog = ({ open, onOpenChange, setImagePreview }: ArticleImageDialogProps) => {
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('upload');
    const [numImages, setNumImages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Redux dispatch
    const dispatch = useAppDispatch();

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError('');
            
            // Create preview URL for the selected file
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsLoading(true);
        setError('');

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result as string;
                
                try {
                    // Send to backend API
                    const jwtToken = localStorage.getItem('jwt_token');
                    const response = await fetch('http://localhost:8000/somaapp/update-profile-picture/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {})
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            profile_picture: base64Data
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to update profile picture');
                    }

                    const data = await response.json();
                    
                    // Update Redux state
                    dispatch(updateUserField({ field: 'profilePicture', value: base64Data }));
                    
                    // Update local state
                    setImagePreview(base64Data);
                    onOpenChange(false);
                    
                } catch (apiError) {
                    setError((apiError as Error).message);
                } finally {
                    setIsLoading(false);
                }
            };
            reader.readAsDataURL(selectedFile);
        } catch (e) {
            setError((e as Error).message);
            setIsLoading(false);
        }
    };

    const handleClear = (e: React.FormEvent) => {
        e.preventDefault();
        setImageUrl('');
        setError('');
        setSelectedFile(null);
        setPreviewUrl(null);
        onOpenChange(false);
    };

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setImageUrl('');
            setError('');
            setSelectedFile(null);
            setPreviewUrl(null);
            setIsLoading(false);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex flex-col items-center justify-center font-playfair-display w-[400px] rounded-lg text-center">
                <DialogHeader className="w-full">
                    <DialogTitle className="text-center">Upload Image</DialogTitle>
                </DialogHeader>
                {/* Profile Picture Preview */}
                <div className="border border-gray-300 h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    {previewUrl ? (
                        <img 
                            src={previewUrl} 
                            alt="Profile preview" 
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <div className="text-gray-400 text-sm text-center">
                            No image selected
                        </div>
                    )}
                </div>
                <form onSubmit={handleFileUpload} className="w-full">
                    <div className="grid gap-4 py-4">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                            disabled={isLoading}
                        />
                        {selectedFile && (
                            <p className="text-sm text-gray-500 text-center">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}
                    </div>
                    <DialogFooter className="flex justify-center gap-2">
                        <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
                            Clear
                        </Button>
                        <Button type="submit" disabled={!selectedFile || isLoading} className="bg-secondary text-white hover:bg-secondary/80">
                            {isLoading ? 'Updating...' : 'Change'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ArticleImageDialog; 