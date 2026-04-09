"use client"

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LinkDialogProps {
    editor: Editor | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LinkDialog = ({ editor, open, onOpenChange }: LinkDialogProps) => {
    const [url, setUrl] = useState('');

    // Reset URL when dialog opens
    React.useEffect(() => {
        if (open && editor) {
            const previousUrl = editor.getAttributes('link').href;
            setUrl(previousUrl || '');
        }
    }, [open, editor]);

    // Link Pop Up Handle Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editor) return;

        // If URL is empty, unset link
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            try {
                // Ensure the URL has a protocol
                const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
                    ? url 
                    : `https://${url}`;

                editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: urlWithProtocol })
                    .run();
            } catch (e) {
                alert((e as Error).message);
            }
        }
        onOpenChange(false);
    };

    const handleClear = (e: React.FormEvent) => {
        e.preventDefault();
        setUrl('');
        if (editor) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Link</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Enter URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="outline" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button type="submit" className="bg-secondary text-white hover:bg-secondary/80">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LinkDialog; 