"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ArticleDescriptionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDescriptionGenerated?: (description: string) => void;
}

const ArticleDescriptionDialog = ({ 
    open, 
    onOpenChange,
    onDescriptionGenerated
}: ArticleDescriptionDialogProps) => {
    const [topic, setTopic] = useState('');
    const [numDescriptions, setNumDescriptions] = useState(1);

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setTopic('');
            setNumDescriptions(1);
        }
    }, [open]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement description generation logic
        if (onDescriptionGenerated) {
            onDescriptionGenerated("Generated description will go here");
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-playfair-display">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Enter Article Heading</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Enter your article heading..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <DialogHeader>
                        <DialogTitle>Number of Descriptions</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Input
                            type="number"
                            min="1"
                            max="5"
                            step="1"
                            value={numDescriptions}
                            onChange={(e) => setNumDescriptions(parseInt(e.target.value))}
                            placeholder="Enter number of descriptions (1-5)"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-secondary text-white hover:bg-secondary/80">
                            Generate
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ArticleDescriptionDialog; 