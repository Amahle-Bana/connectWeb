"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ArticleHeadingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setAudioFile: React.Dispatch<React.SetStateAction<File | null>>;
    setAudioPreview: React.Dispatch<React.SetStateAction<string | null>>;
    setAudioDuration: React.Dispatch<React.SetStateAction<number>>;
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArticleHeadingDialog = ({ 
    open, 
    onOpenChange,
    setAudioFile,
    setAudioPreview,
    setAudioDuration,
    setCurrentTime,
    setIsPlaying
}: ArticleHeadingDialogProps) => {
    const [topic, setTopic] = useState('');
    const [numTitles, setNumTitles] = useState(1);

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setTopic('');
            setNumTitles(1);
        }
    }, [open]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement heading generation logic
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-playfair-display rounded-lg w-[300px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Enter Topic 1</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Enter Your Blog Topic..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <DialogHeader>
                        <DialogTitle>Number Of Headings</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            step="1"
                            value={numTitles}
                            onChange={(e) => setNumTitles(parseInt(e.target.value))}
                            placeholder="Enter Number Of Titles You Want (1-10)"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Exit
                        </Button>
                        <Button type="submit" className="bg-secondary text-white hover:bg-secondary/80 mb-2">
                            Generate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ArticleHeadingDialog; 