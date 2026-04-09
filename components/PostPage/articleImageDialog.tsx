"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ArticleImageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setImagePreview: (preview: string | null) => void;
}

const ArticleImageDialog = ({ open, onOpenChange, setImagePreview }: ArticleImageDialogProps) => {
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState('upload');
    const [numImages, setNumImages] = useState(1);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError('');
        }
    };

    // Handle URL submission
    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (imageUrl === '') {
            onOpenChange(false);
            return;
        }

        try {
            const urlWithProtocol = imageUrl.startsWith('http://') || imageUrl.startsWith('https://') 
                ? imageUrl 
                : `https://${imageUrl}`;

            const img = new window.Image();
            img.onload = () => {
                setImagePreview(urlWithProtocol);
                onOpenChange(false);
            };
            img.onerror = () => {
                setError('Invalid image URL or image could not be loaded');
            };
            img.src = urlWithProtocol;
        } catch (e) {
            setError((e as Error).message);
        }
    };

    // Handle file upload
    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                onOpenChange(false);
            };
            reader.readAsDataURL(selectedFile);
        } catch (e) {
            setError((e as Error).message);
        }
    };

    const handleClear = (e: React.FormEvent) => {
        e.preventDefault();
        setImageUrl('');
        setError('');
        setSelectedFile(null);
        onOpenChange(false);
    };

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setImageUrl('');
            setError('');
            setSelectedFile(null);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-playfair-display">
                <DialogHeader>
                    <DialogTitle className="">Add/Generator Article Image</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                        <TabsTrigger value="url">Insert URL</TabsTrigger>
                        <TabsTrigger value="generate">Generate <img src="/sparkles2.png" alt="Sparkles" className="w-5 h-5 cursor-pointer rounded-sm hover:bg-muted" /></TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload">
                        <form onSubmit={handleFileUpload}>
                            <div className="grid gap-4 py-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                                {selectedFile && (
                                    <p className="text-sm text-gray-500">
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" variant="outline" onClick={handleClear}>
                                    Clear
                                </Button>
                                <Button type="submit" disabled={!selectedFile} className="bg-secondary text-white hover:bg-secondary/80">
                                    Upload Image
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="url">
                        <form onSubmit={handleUrlSubmit}>
                            <div className="grid gap-4 py-4">
                                <Input
                                    placeholder="Enter image URL"
                                    value={imageUrl}
                                    onChange={(e) => {
                                        setImageUrl(e.target.value);
                                        setError('');
                                    }}
                                    autoFocus
                                />
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" variant="outline" onClick={handleClear}>
                                    Clear
                                </Button>
                                <Button type="submit" className="bg-secondary text-white hover:bg-secondary/80">
                                    Insert Image
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>


                    <TabsContent value="generate">
                        <form onSubmit={handleUrlSubmit}>
                            <div className="grid gap-4 py-4">
                                <DialogHeader>
                                    <DialogTitle>Describe Image</DialogTitle>
                                </DialogHeader>
                                <Input
                                    placeholder="Describe The Image You Want..."
                                    value={imageUrl}
                                    onChange={(e) => {
                                        setImageUrl(e.target.value);
                                        setError('');
                                    }}
                                    autoFocus
                                />

                                <DialogHeader>
                                    <DialogTitle>Number Of Images</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="3"
                                        step="1"
                                        value={numImages}
                                        onChange={(e) => setNumImages(parseInt(e.target.value))}
                                        placeholder="Enter Number Of Images You Want (1-10)"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" variant="outline" onClick={handleClear}>
                                    Exit
                                </Button>
                                <Button type="submit" className="bg-secondary text-white hover:bg-secondary/80">
                                    Generate
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export default ArticleImageDialog; 