"use client"

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface ArticleAudioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setAudioFile: (file: File | null) => void;
    setAudioPreview: (preview: string | null) => void;
    setAudioDuration: (duration: number) => void;
    setCurrentTime: (time: number) => void;
    setIsPlaying: (playing: boolean) => void;
}

const ArticleAudioDialog = ({ 
    open, 
    onOpenChange, 
    setAudioFile,
    setAudioPreview,
    setAudioDuration,
    setCurrentTime,
    setIsPlaying
}: ArticleAudioDialogProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localAudioPreview, setLocalAudioPreview] = useState<string | null>(null);
    const [localAudioDuration, setLocalAudioDuration] = useState(0);
    const [localCurrentTime, setLocalCurrentTime] = useState(0);
    const [localIsPlaying, setLocalIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [activeTab, setActiveTab] = useState('upload');

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open) {
            setSelectedFile(null);
            setLocalAudioPreview(null);
            setLocalAudioDuration(0);
            setLocalCurrentTime(0);
            setLocalIsPlaying(false);
        }
    }, [open]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setLocalAudioPreview(url);
            
            // Create audio element to get duration
            const audio = new Audio(url);
            audio.addEventListener('loadedmetadata', () => {
                setLocalAudioDuration(audio.duration);
            });
        }
    };

    // Handle audio upload
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        try {
            setAudioFile(selectedFile);
            setAudioPreview(localAudioPreview);
            setAudioDuration(localAudioDuration);
            setCurrentTime(0);
            setIsPlaying(false);
            onOpenChange(false);
        } catch (e) {
            console.error('Error handling audio:', e);
        }
    };

    const handleClear = (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedFile(null);
        setLocalAudioPreview(null);
        setLocalAudioDuration(0);
        setLocalCurrentTime(0);
        setLocalIsPlaying(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="font-playfair-display">
                <DialogHeader>
                    <DialogTitle>Add Article Audio</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Audio</TabsTrigger>
                        <TabsTrigger value="generate">Generate <img src="/sparkles2.png" alt="Sparkles" className="w-5 h-5 cursor-pointer rounded-sm hover:bg-muted" /></TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload">
                        <form onSubmit={handleUpload}>
                            <div className="grid gap-4 py-4">
                                <Input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                                {selectedFile && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">
                                            Selected: {selectedFile.name}
                                        </p>
                                        <audio
                                            ref={audioRef}
                                            src={localAudioPreview || undefined}
                                            onTimeUpdate={() => {
                                                if (audioRef.current) {
                                                    setLocalCurrentTime(audioRef.current.currentTime);
                                                }
                                            }}
                                            onEnded={() => setLocalIsPlaying(false)}
                                            className="hidden"
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (audioRef.current) {
                                                        if (localIsPlaying) {
                                                            audioRef.current.pause();
                                                        } else {
                                                            audioRef.current.play();
                                                        }
                                                        setLocalIsPlaying(!localIsPlaying);
                                                    }
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                {localIsPlaying ? (
                                                    <Pause className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <Play className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                            <input
                                                type="range"
                                                min={0}
                                                max={localAudioDuration}
                                                value={localCurrentTime}
                                                onChange={(e) => {
                                                    const time = parseFloat(e.target.value);
                                                    if (audioRef.current) {
                                                        audioRef.current.currentTime = time;
                                                        setLocalCurrentTime(time);
                                                    }
                                                }}
                                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(localCurrentTime)} / {formatTime(localAudioDuration)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" variant="outline" onClick={handleClear}>
                                    Clear
                                </Button>
                                <Button type="submit" disabled={!selectedFile} className="bg-secondary text-white hover:bg-secondary/80">
                                    Insert Audio
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="generate">
                        <form onSubmit={handleUpload}>
                            <p className="text-center">
                                Finish Writing Your Article Before Generating Audio
                            </p>
                            <div className="grid gap-4 py-4">
                                <Input
                                    placeholder="Describe The Audio You Want..."
                                    autoFocus
                                />
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
};

export default ArticleAudioDialog; 