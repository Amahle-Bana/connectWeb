"use client"

import React, { useState, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Pause } from 'lucide-react';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const AudioDialog = ({ editor, open, onOpenChange }: { editor: Editor | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Reset state when dialog opens
    React.useEffect(() => {
        if (open && editor) {
            setSelectedFile(null);
            setAudioPreview(null);
            setAudioDuration(0);
            setCurrentTime(0);
            setIsPlaying(false);
        }
    }, [open, editor]);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setAudioPreview(url);
            
            // Create audio element to get duration
            const audio = new Audio(url);
            audio.addEventListener('loadedmetadata', () => {
                setAudioDuration(audio.duration);
            });
        }
    };

    // Handle audio upload
    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editor || !selectedFile) return;

        try {
            // Here you would typically upload the file to your server/storage
            // For now, we'll create a local URL for demonstration
            const fileUrl = URL.createObjectURL(selectedFile);
            
            editor
                .chain()
                .focus()
                .insertContent({
                    type: 'audio',
                    attrs: {
                        src: fileUrl,
                        title: selectedFile.name,
                    },
                })
                .createParagraphNear()
                .run();

            // Log for debugging
            console.log('Audio inserted:', {
                type: 'audio',
                attrs: {
                    src: fileUrl,
                    title: selectedFile.name,
                }
            });

            onOpenChange(false);
        } catch (e) {
            console.error('Error inserting audio:', e);
        }
    };

    const handleClear = (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedFile(null);
        setAudioPreview(null);
        setAudioDuration(0);
        setCurrentTime(0);
        setIsPlaying(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Audio</DialogTitle>
                </DialogHeader>
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
                                    src={audioPreview || undefined}
                                    onTimeUpdate={() => {
                                        if (audioRef.current) {
                                            setCurrentTime(audioRef.current.currentTime);
                                        }
                                    }}
                                    onEnded={() => setIsPlaying(false)}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (audioRef.current) {
                                                if (isPlaying) {
                                                    audioRef.current.pause();
                                                } else {
                                                    audioRef.current.play();
                                                }
                                                setIsPlaying(!isPlaying);
                                            }
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <Play className="w-4 h-4 text-gray-500" />
                                        )}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={audioDuration}
                                        value={currentTime}
                                        onChange={(e) => {
                                            const time = parseFloat(e.target.value);
                                            if (audioRef.current) {
                                                audioRef.current.currentTime = time;
                                                setCurrentTime(time);
                                            }
                                        }}
                                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <span className="text-xs text-gray-500">
                                    {formatTime(currentTime)} / {formatTime(audioDuration)}
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
            </DialogContent>
        </Dialog>
    );
};

export default AudioDialog; 