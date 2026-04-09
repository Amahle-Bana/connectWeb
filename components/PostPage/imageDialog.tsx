"use client"

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const ImageDialog = ({ editor, open, onOpenChange }: { editor: Editor | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState('upload');

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
        if (!editor) return;

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
                editor
                    .chain()
                    .focus()
                    .setImage({ 
                        src: urlWithProtocol,
                        alt: 'Inserted image',
                        title: 'Image',
                    })
                    .createParagraphNear()
                    .run();
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
        if (!editor || !selectedFile) return;

        try {
            // Here you would typically upload the file to your server/storage
            // For now, we'll create a local URL for demonstration
            const fileUrl = URL.createObjectURL(selectedFile);
            
            editor
                .chain()
                .focus()
                .setImage({ 
                    src: fileUrl,
                    alt: selectedFile.name,
                    title: selectedFile.name,
                })
                .createParagraphNear()
                .run();
            onOpenChange(false);
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
        if (open && editor) {
            const previousUrl = editor.getAttributes('image').src;
            setImageUrl(previousUrl || '');
            setError('');
            setSelectedFile(null);
        }
    }, [open, editor]);


    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Image</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                        <TabsTrigger value="url">Insert URL</TabsTrigger>
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
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export default ImageDialog; 