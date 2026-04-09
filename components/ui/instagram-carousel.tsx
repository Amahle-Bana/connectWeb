"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InstagramCarouselProps {
    images: string[];
    alt?: string;
    className?: string;
}

// Helper function to check if a file is a video
const isVideoFile = (url: string): boolean => {
    if (!url || typeof url !== 'string') {
        console.log('🚫 Invalid URL for video check:', url);
        return false;
    }

    // Handle base64 data URLs
    if (url.startsWith('data:')) {
        try {
            const mimeType = url.split(';')[0].split(':')[1];
            const isVideo = mimeType.startsWith('video/');

            console.log('🎥 Base64 media check:', {
                url: url.substring(0, 50) + '...',
                mimeType: mimeType,
                isVideo: isVideo,
                isImage: mimeType.startsWith('image/')
            });

            return isVideo;
        } catch (error) {
            console.error('❌ Error parsing base64 MIME type:', error);
            return false;
        }
    }

    // Handle regular file URLs (fallback)
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const lowerUrl = url.toLowerCase();
    const isVideo = videoExtensions.some(ext => lowerUrl.includes(ext));

    console.log('🎥 File extension video check:', {
        url: url,
        lowerUrl: lowerUrl,
        isVideo: isVideo,
        matchedExtension: videoExtensions.find(ext => lowerUrl.includes(ext))
    });

    return isVideo;
};

// Helper function to get file type
const getFileType = (url: string): 'image' | 'video' => {
    if (!url || typeof url !== 'string') return 'image';
    return isVideoFile(url) ? 'video' : 'image';
};

export const InstagramCarousel: React.FC<InstagramCarouselProps> = ({
    images,
    alt = "Post media",
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

    // Debug logging
    console.log('🎠 InstagramCarousel received:', {
        images: images,
        imagesType: typeof images,
        imagesLength: images ? images.length : 'undefined',
        alt: alt,
        className: className
    });

    // Filter out null/undefined/empty values and ensure all items are strings
    const validMedia = images.filter((item): item is string =>
        Boolean(item && typeof item === 'string' && item.trim().length > 0)
    );

    console.log('✅ Filtered valid media:', {
        validMedia: validMedia,
        validMediaLength: validMedia.length,
        originalLength: images ? images.length : 0,
        mediaTypes: validMedia.map(url => ({ url, type: getFileType(url) }))
    });

    const goToNext = () => {
        if (currentIndex < validMedia.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsVideoPlaying(false);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsVideoPlaying(false);
        }
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsVideoPlaying(false);
    };

    const toggleVideoPlayback = () => {
        if (videoRef.current) {
            if (isVideoPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };

    const toggleFullscreenVideoPlayback = () => {
        if (fullscreenVideoRef.current) {
            if (isVideoPlaying) {
                fullscreenVideoRef.current.pause();
            } else {
                fullscreenVideoRef.current.play();
            }
            setIsVideoPlaying(!isVideoPlaying);
        }
    };

    const openFullscreen = () => {
        setIsFullscreen(true);
        setIsVideoPlaying(false); // Reset video playback when opening fullscreen
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
        setIsVideoPlaying(false);
    };

    // Pause video when switching slides
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        }
    }, [currentIndex]);

    // Reset current index if it's out of bounds after filtering
    useEffect(() => {
        if (currentIndex >= validMedia.length && validMedia.length > 0) {
            setCurrentIndex(0);
        }
    }, [validMedia.length, currentIndex]);

    // Handle fullscreen video playback state
    useEffect(() => {
        if (fullscreenVideoRef.current && isFullscreen) {
            if (isVideoPlaying) {
                fullscreenVideoRef.current.play();
            } else {
                fullscreenVideoRef.current.pause();
            }
        }
    }, [isVideoPlaying, isFullscreen]);

    // Handle keyboard events for fullscreen (must run before any conditional return — rules-of-hooks)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isFullscreen) return;
            if (validMedia.length === 0) return;

            const currentMediaItem = validMedia[currentIndex];
            const isCurrentMediaVideoKey = currentMediaItem
                ? getFileType(currentMediaItem) === 'video'
                : false;

            switch (event.key) {
                case 'Escape':
                    closeFullscreen();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    goToNext();
                    break;
                case ' ':
                    event.preventDefault();
                    if (isCurrentMediaVideoKey) {
                        toggleFullscreenVideoPlayback();
                    }
                    break;
            }
        };

        if (isFullscreen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen, currentIndex, validMedia, isVideoPlaying]);

    if (validMedia.length === 0) return null;

    const currentMedia = validMedia[currentIndex];
    const mediaType = getFileType(currentMedia);
    const isCurrentMediaVideo = mediaType === 'video';

    console.log('🎬 Rendering media:', {
        currentIndex,
        currentMedia: currentMedia ? currentMedia.substring(0, 50) + '...' : 'none',
        mediaType: mediaType,
        isVideo: isCurrentMediaVideo,
        totalMedia: validMedia.length,
        mimeType: currentMedia ? (currentMedia.startsWith('data:') ? currentMedia.split(';')[0].split(':')[1] : 'file') : 'none',
        detectionResult: currentMedia ? {
            startsWithData: currentMedia.startsWith('data:'),
            mimeType: currentMedia.startsWith('data:') ? currentMedia.split(';')[0].split(':')[1] : 'N/A',
            isVideoDetected: isCurrentMediaVideo,
            isImageDetected: !isCurrentMediaVideo
        } : 'none'
    });

    return (
        <>
            <div
                className={`relative w-full h-64 overflow-hidden ${className}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                ref={containerRef}
            >
            {/* Media Container */}
            <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        {isCurrentMediaVideo ? (
                            <div className="relative w-full h-full cursor-pointer" onClick={openFullscreen}>
                                <video
                                    ref={videoRef}
                                    src={currentMedia}
                                    className="w-full h-full object-cover"
                                    onPlay={() => setIsVideoPlaying(true)}
                                    onPause={() => setIsVideoPlaying(false)}
                                    onEnded={() => setIsVideoPlaying(false)}
                                    loop
                                    muted
                                    controls={false}
                                />
                                {/* Video Play/Pause Overlay */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleVideoPlayback();
                                    }}
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200"
                                >
                                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                                        {isVideoPlaying ? (
                                            <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                                        ) : (
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="relative w-full h-full cursor-pointer" onClick={openFullscreen}>
                                {/* Try Next.js Image first */}
                                <Image
                                    src={currentMedia}
                                    alt={`${alt} ${currentIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={currentIndex === 0}
                                    unoptimized={currentMedia.startsWith('data:')} // Disable optimization for base64 data URLs
                                    onError={(e) => {
                                        console.error('❌ Next.js Image failed to load:', {
                                            currentMedia: currentMedia.substring(0, 100) + '...',
                                            mimeType: currentMedia.startsWith('data:') ? currentMedia.split(';')[0].split(':')[1] : 'file',
                                            error: e
                                        });
                                        // Fallback to regular img element
                                        e.currentTarget.style.display = 'none';
                                        const fallbackImg = e.currentTarget.parentElement?.querySelector('.fallback-img') as HTMLImageElement;
                                        if (fallbackImg) {
                                            fallbackImg.style.display = 'block';
                                        }
                                    }}
                                    onLoad={() => {
                                        console.log('✅ Next.js Image loaded successfully:', {
                                            currentMedia: currentMedia.substring(0, 100) + '...',
                                            mimeType: currentMedia.startsWith('data:') ? currentMedia.split(';')[0].split(':')[1] : 'file'
                                        });
                                    }}
                                />

                                {/* Fallback when next/image fails; native img for data URLs */}
                                <img
                                    src={currentMedia}
                                    alt={`${alt} ${currentIndex + 1}`}
                                    className="object-cover w-full h-full fallback-img"
                                    style={{ display: 'none' }} // Hidden by default
                                    onError={(e) => {
                                        console.error('❌ Fallback img also failed to load:', {
                                            currentMedia: currentMedia.substring(0, 100) + '...',
                                            mimeType: currentMedia.startsWith('data:') ? currentMedia.split(';')[0].split(':')[1] : 'file',
                                            error: e
                                        });
                                    }}
                                    onLoad={() => {
                                        console.log('✅ Fallback img loaded successfully:', {
                                            currentMedia: currentMedia.substring(0, 100) + '...',
                                            mimeType: currentMedia.startsWith('data:') ? currentMedia.split(';')[0].split(':')[1] : 'file'
                                        });
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows - Only show if multiple media items */}
            {validMedia.length > 1 && (
                <>
                    {/* Left Arrow */}
                    {currentIndex > 0 && (
                        <button
                            onClick={goToPrevious}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-100'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {currentIndex < validMedia.length - 1 && (
                        <button
                            onClick={goToNext}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-100'
                                }`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </>
            )}

            {/* Dots Indicator - Only show if multiple media items */}
            {validMedia.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                    {validMedia.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                ? 'bg-white scale-125'
                                : 'bg-white/75 hover:bg-white'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Media Counter - Only show if multiple media items */}
            {validMedia.length > 1 && (
                <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentIndex + 1} / {validMedia.length}
                </div>
            )}

            {/* Swipe Indicators - Show multiple dots at the top for Instagram-style */}
            {validMedia.length > 1 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex space-x-1">
                    {validMedia.map((_, index) => (
                        <div
                            key={index}
                            className={`w-1 h-1 rounded-full transition-all duration-200 ${index === currentIndex
                                ? 'bg-white'
                                : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Media Type Indicator */}
            <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {isCurrentMediaVideo ? 'VIDEO' : 'IMAGE'}
            </div>
        </div>

        {/* Fullscreen Modal */}
        <AnimatePresence>
            {isFullscreen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
                    onClick={closeFullscreen}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            closeFullscreen();
                        }}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Fullscreen Media Container */}
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="relative max-w-5xl max-h-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isCurrentMediaVideo ? (
                                    <div className="relative">
                                        <video
                                            ref={fullscreenVideoRef}
                                            src={currentMedia}
                                            className="max-w-full max-h-full object-contain"
                                            onPlay={() => setIsVideoPlaying(true)}
                                            onPause={() => setIsVideoPlaying(false)}
                                            onEnded={() => setIsVideoPlaying(false)}
                                            loop
                                            controls={false}
                                        />
                                        {/* Fullscreen Video Play/Pause Overlay */}
                                        <button
                                            onClick={toggleFullscreenVideoPlayback}
                                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200"
                                        >
                                            <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
                                                {isVideoPlaying ? (
                                                    <div className="w-0 h-0 border-l-[16px] border-l-white border-y-[12px] border-y-transparent ml-1" />
                                                ) : (
                                                    <Play className="w-10 h-10 text-white ml-1" />
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={currentMedia}
                                            alt={`${alt} ${currentIndex + 1}`}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Fullscreen Navigation Arrows */}
                        {validMedia.length > 1 && (
                            <>
                                {/* Left Arrow */}
                                {currentIndex > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToPrevious();
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                                    >
                                        <ChevronLeft className="w-8 h-8" />
                                    </button>
                                )}

                                {/* Right Arrow */}
                                {currentIndex < validMedia.length - 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToNext();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                                    >
                                        <ChevronRight className="w-8 h-8" />
                                    </button>
                                )}
                            </>
                        )}

                        {/* Fullscreen Counter */}
                        {validMedia.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-2 rounded-full">
                                {currentIndex + 1} / {validMedia.length}
                            </div>
                        )}

                        {/* Fullscreen Media Type Indicator */}
                        <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-2 rounded-full">
                            {isCurrentMediaVideo ? 'VIDEO' : 'IMAGE'}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
    );
}; 