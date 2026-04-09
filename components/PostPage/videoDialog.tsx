"use client"

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';

type EditorChain = ReturnType<Editor['chain']>;
type ChainWithVideo = EditorChain & {
    setVideo: (attrs: { src: string; title: string }) => EditorChain;
};
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const VideoDialog = ({ editor, open, onOpenChange }: { editor: Editor | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open && editor) {
            setError('');
            setSelectedFile(null);
        }
    }, [open, editor]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('video/')) {
                setSelectedFile(file);
                setError('');
            } else {
                setError('Please select a valid video file');
                setSelectedFile(null);
            }
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

            const chain = editor.chain().focus() as ChainWithVideo;
            chain
                .setVideo({
                    src: fileUrl,
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
        setError('');
        setSelectedFile(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Video</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleFileUpload}>
                    <div className="grid gap-4 py-4">
                        <Input
                            type="file"
                            accept="video/*"
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
                            Upload Video
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default VideoDialog; 