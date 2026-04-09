'use client';

import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Settings, Info, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail } from 'lucide-react';
import { useTheme } from "next-themes"
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Compass, UserCircleIcon, Search, LayoutDashboard, ImageIcon, VideoIcon, X, Play, Pause } from 'lucide-react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Dialog7, DialogContent7, DialogHeader7, DialogTitle7, DialogDescription7 } from '@/components/PodcastsPage/dialog7';
import { NotificationsDialog } from "@/components/PodcastsPage/notificationsDialog";
import { SearchQueryDialog } from "@/components/PodcastsPage/searchQueryDialog";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import useWindowSize from '@/hooks/useWindow';
import { UserSidebar } from '@/components/HomePage/userSidebar';
import PublicationDetailsSheet from '@/components/PodcastsPage/PublicationDetailsSheet';
import { useAppSelector } from "@/redux/hooks";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandThreads, IconBrandTiktok, IconBrandX, IconBrandYoutube, IconWorld } from '@tabler/icons-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PartyListItem {
    id: number;
    party_name: string;
}

interface PostMediaPayload {
    name: string;
    type: string;
    size: number;
    data: string;
}

const categories = [
    'All',
    'Technology',
    'Business',
    'Science',
    'Health',
    'Arts',
    'Sports',
    'Politics',
    'Education',
    'Entertainment',
    'Food',
    'Travel',
    'Fashion',
    'Finance',
    'Lifestyle',
    'World News',
    'Culture',
    'Innovation',
    'Career'
];

const searchCategories = [
    "All",
    "Polical Parties",
    "Leaders",
]

const notificationCategories = [
    "All"
]





export default function AddPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const categoriesScrollRef = useRef<HTMLDivElement>(null);
    const articlesScrollRefAll1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefAll2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSubscribe1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSubscribe2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefMedia1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefMedia2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSaved1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSaved2 = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Search Query useState()
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // Post creation state
    const [postText, setPostText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Media upload state
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);

    // File input refs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();

    // useWindowSize
    const { width } = useWindowSize();

    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    const currentUser = useAppSelector((state) => state.user);

    // Party selection state
    const [audience, setAudience] = useState('');
    const [parties, setParties] = useState<PartyListItem[]>([]);
    const [selectedParties, setSelectedParties] = useState<number[]>([]);
    const [loadingParties, setLoadingParties] = useState(false);

    // Function to test authentication
    const testAuthentication = async () => {
        try {
            // Get JWT token from localStorage as fallback like the auth context does
            const jwtToken = localStorage.getItem('jwt_token');

            const response = await fetch('http://localhost:8000/somaapp/user/', {
                method: 'GET',
                credentials: 'include',
                headers: jwtToken ? {
                    'Authorization': `Bearer ${jwtToken}`
                } : {}
            });
            const result = await response.json();
            console.log('Auth test result:', result);
            return response.ok;
        } catch (error) {
            console.error('Auth test failed:', error);
            return false;
        }
    };

    // Function to fetch parties from API
    const fetchParties = async () => {
        try {
            setLoadingParties(true);
            const jwtToken = localStorage.getItem('jwt_token');

            const response = await fetch('http://localhost:8000/somaapp/get-all-parties/', {
                method: 'GET',
                credentials: 'include',
                headers: jwtToken ? {
                    'Authorization': `Bearer ${jwtToken}`
                } : {}
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Parties fetched:', result);
                setParties(result.parties || []);
            } else {
                console.error('Failed to fetch parties');
                setParties([]);
            }
        } catch (error) {
            console.error('Error fetching parties:', error);
            setParties([]);
        } finally {
            setLoadingParties(false);
        }
    };

    useEffect(() => {
        fetchParties(); // Fetch parties when component mounts
    }, []);

    // scroll function
    const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null> = scrollContainerRef) => {
        if (ref.current) {
            const scrollAmount = 200;
            const newScrollLeft = ref.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            ref.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoriesScrollRef.current) {
            const scrollAmount = 200;
            const newScrollLeft = categoriesScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            categoriesScrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const scrollArticles = (direction: 'left' | 'right') => {
        if (articlesScrollRefAll1.current) {
            const scrollAmount = 200;
            const newScrollLeft = articlesScrollRefAll1.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            articlesScrollRefAll1.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        e.preventDefault();
        setIsScrolling(true);
        if (ref.current) {
            ref.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current && isScrolling) {
            const movement = e.movementX * 2;
            ref.current.scrollLeft -= movement;
        }
    };

    const handleMouseUp = () => {
        setIsScrolling(false);
        if (articlesScrollRefAll1.current) {
            articlesScrollRefAll1.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        setIsScrolling(false);
        if (articlesScrollRefAll1.current) {
            articlesScrollRefAll1.current.style.cursor = 'grab';
        }
    };

    // Function to convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Handle post creation
    const handlePost = async () => {
        if (postText.trim() && !isPosting) {
            setIsPosting(true);

            try {
                // Debug: Check authentication state
                console.log('Current user:', currentUser);
                console.log('Is authenticated:', isAuthenticated);
                console.log('Document cookies:', document.cookie);

                // Test authentication with backend
                const isAuthValid = await testAuthentication();
                console.log('Authentication test result:', isAuthValid);

                // Check if user is logged in
                if (!currentUser.id || !isAuthenticated || !isAuthValid) {
                    alert('Please log in to create a post. Redirecting to login page...');
                    setIsPosting(false);
                    router.push('/authentication');
                    return;
                }
                // For now, let's test without media files to debug the basic functionality
                let images: PostMediaPayload[] = [];
                let videos: PostMediaPayload[] = [];

                // Only process media files if there are any (to avoid issues)
                if (uploadedImages.length > 0) {
                    console.log('Processing images...');
                    const imagePromises = uploadedImages.map(async (file) => {
                        const base64 = await fileToBase64(file);
                        return {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: base64
                        };
                    });
                    images = await Promise.all(imagePromises);
                }

                if (uploadedVideos.length > 0) {
                    console.log('Processing videos...');
                    const videoPromises = uploadedVideos.map(async (file) => {
                        const base64 = await fileToBase64(file);
                        return {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: base64
                        };
                    });
                    videos = await Promise.all(videoPromises);
                }

                // Prepare post data
                const postData = {
                    content: postText.trim(),
                    images: images,
                    videos: videos,
                    is_anonymous: isAnonymous,
                    parties_ids: selectedParties, // Include selected party IDs
                    // Include current user information
                    user_data: {
                        username: currentUser.username,
                        email: currentUser.email,
                        fullName: currentUser.fullName,
                        profilePicture: currentUser.profilePicture
                    }
                };

                console.log('Final post data size:', JSON.stringify(postData).length, 'characters');

                console.log('Creating post:', postData);

                // Get JWT token from localStorage for Authorization header
                const jwtToken = localStorage.getItem('jwt_token');

                // Make API call to create post
                const response = await fetch('http://localhost:8000/somaapp/create-post/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {})
                    },
                    credentials: 'include', // Include cookies for authentication
                    body: JSON.stringify(postData)
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);

                // Try to parse JSON response
                let result;
                try {
                    result = await response.json();
                    console.log('Response data:', result);
                } catch (parseError) {
                    console.error('Failed to parse JSON response:', parseError);
                    const textResponse = await response.text();
                    console.log('Raw response:', textResponse);
                    throw new Error('Invalid JSON response from server');
                }

                if (response.ok) {
                    // Success - clear form and show success message
                    setPostText('');
                    setUploadedImages([]);
                    setUploadedVideos([]);
                    setImagePreviews([]);
                    setVideoPreviews([]);
                    setIsAnonymous(false);
                    setSelectedParties([]); // Clear selected parties

                    console.log('Post created successfully:', result);

                    // TODO: Show success toast/notification
                    // alert('Post created successfully!');

                    // TODO: Redirect to home feed or refresh posts
                    router.push('/home');
                } else {
                    // Error
                    console.error('Error creating post:', result);
                    alert(result.error || 'Failed to create post. Please try again.');
                }
            } catch (error) {
                console.error('Error creating post:', error);
                alert('Failed to create post. Please check your connection and try again.');
            } finally {
                setIsPosting(false);
            }
        }
    };

    // Handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validImageFiles = files.filter(file => file.type.startsWith('image/'));

        if (validImageFiles.length > 0) {
            // Limit to 4 images total
            const remainingSlots = 4 - uploadedImages.length;
            const filesToAdd = validImageFiles.slice(0, remainingSlots);

            setUploadedImages(prev => [...prev, ...filesToAdd]);

            // Create preview URLs
            const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviewUrls]);
        }

        // Reset the input
        if (event.target) {
            event.target.value = '';
        }
    };

    // Handle video upload
    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validVideoFiles = files.filter(file => file.type.startsWith('video/'));

        if (validVideoFiles.length > 0) {
            // Limit to 2 videos total
            const remainingSlots = 2 - uploadedVideos.length;
            const filesToAdd = validVideoFiles.slice(0, remainingSlots);

            setUploadedVideos(prev => [...prev, ...filesToAdd]);

            // Create preview URLs
            const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
            setVideoPreviews(prev => [...prev, ...newPreviewUrls]);
        }

        // Reset the input
        if (event.target) {
            event.target.value = '';
        }
    };

    // Remove image
    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            URL.revokeObjectURL(prev[index]); // Clean up memory
            return prev.filter((_, i) => i !== index);
        });
    };

    // Remove video
    const removeVideo = (index: number) => {
        setUploadedVideos(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => {
            URL.revokeObjectURL(prev[index]); // Clean up memory
            return prev.filter((_, i) => i !== index);
        });
        // Reset playing video if it was the one being removed
        if (playingVideo === index) {
            setPlayingVideo(null);
        }
    };

    // Toggle video play/pause
    const toggleVideoPlay = (index: number) => {
        const videoElement = document.getElementById(`video-${index}`) as HTMLVideoElement;
        if (videoElement) {
            if (playingVideo === index) {
                videoElement.pause();
                setPlayingVideo(null);
            } else {
                // Pause any other playing video
                if (playingVideo !== null) {
                    const currentVideo = document.getElementById(`video-${playingVideo}`) as HTMLVideoElement;
                    if (currentVideo) {
                        currentVideo.pause();
                    }
                }
                videoElement.play();
                setPlayingVideo(index);
            }
        }
    };

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            videoPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    // Theme support
    const { theme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen font-comfortaa">


            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    {/* Right - Back button */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() => router.back()}
                            aria-label="Go back"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Categories Bar */}





            {/* Main Content */}
            <main className="flex-1 h-[calc(100vh-4rem)] px-2 py-4 mt-[4rem] bg-background sm:px-4 md:px-6">

                <>
                    {/* Left Section - 20% */}
                    <section className="hidden xl:block w-[18%] bg-background p-4 fixed h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


                    </section>

                    {/* Middle Section - Responsive */}
                    <section className="w-full h-full max-w-2xl mx-auto xl:max-w-none xl:w-[50%] xl:ml-[20%] bg-background">
                        {/* Post Creation Interface */}
                        <div className="h-full dark:border-gray-800 border p-3 sm:p-4 md:p-6 rounded-lg bg-card shadow-sm flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                                <div className="flex-shrink-0 flex flex-row items-center gap-2 sm:gap-3">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                                        {currentUser.profilePicture === null ? (
                                            <div className="flex items-center justify-center text-blue-500 text-sm sm:text-lg font-bold h-full w-full bg-blue-50 dark:bg-blue-900/20">
                                                {currentUser.username.charAt(0).toUpperCase()}
                                            </div>
                                        ) : (
                                            <Image
                                                src={currentUser.profilePicture}
                                                alt={`${currentUser.fullName}'s Profile picture`}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-semibold">Post</h2>
                                </div>
                            </div>

                            {/* Post Creation Area */}
                            <div className="flex-1 flex flex-col space-y-4">
                                {/* Text Input */}
                                <textarea
                                    value={postText}
                                    onChange={(e) => setPostText(e.target.value)}
                                    placeholder="What's happening?"
                                    className="flex-1 w-full text-lg sm:text-xl placeholder-gray-500 dark:placeholder-gray-400 bg-transparent border-none outline-none resize-none text-foreground p-3 rounded-md min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
                                    maxLength={500}
                                />

                                {/* Media Preview Section */}
                                {(imagePreviews.length > 0 || videoPreviews.length > 0) && (
                                    <div className="space-y-4">
                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Images ({imagePreviews.length}/4)</h4>
                                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                            <Image
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                width={200}
                                                                height={200}
                                                                className="w-full h-32 sm:h-40 object-cover"
                                                            />
                                                            <button
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                                {uploadedImages[index]?.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Video Previews */}
                                        {videoPreviews.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Videos ({videoPreviews.length}/2)</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                    {videoPreviews.map((preview, index) => (
                                                        <div key={index} className="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                            <video
                                                                id={`video-${index}`}
                                                                src={preview}
                                                                className="w-full h-32 sm:h-40 object-cover"
                                                                muted
                                                                onEnded={() => setPlayingVideo(null)}
                                                            />
                                                            <button
                                                                onClick={() => removeVideo(index)}
                                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={() => toggleVideoPlay(index)}
                                                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
                                                            >
                                                                {playingVideo === index ? (
                                                                    <Pause className="w-8 h-8 text-white" />
                                                                ) : (
                                                                    <Play className="w-8 h-8 text-white" />
                                                                )}
                                                            </button>
                                                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                                {uploadedVideos[index]?.name}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bottom Section - Fixed at bottom */}
                                <div className="mt-auto space-y-4">
                                    {/* Privacy Notice */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="anonymous"
                                                checked={isAnonymous}
                                                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                                            />
                                            <label
                                                htmlFor="anonymous"
                                                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                                            >
                                                Anonymous Post
                                            </label>
                                        </div>

                                        {/* Parties */}
                                        <div className="space-y-2">
                                            <Label htmlFor="parties">Party (Optional)</Label>
                                            {loadingParties ? (
                                                <div className="text-sm text-gray-500">Loading parties...</div>
                                            ) : (
                                                <Select
                                                    value={selectedParties.length > 0 ? selectedParties[0].toString() : "none"}
                                                    onValueChange={(value) => {
                                                        if (value && value !== "none") {
                                                            setSelectedParties([parseInt(value)]);
                                                        } else {
                                                            setSelectedParties([]);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a party" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">No party</SelectItem>
                                                        {parties.map((party) => (
                                                            <SelectItem key={party.id} value={party.id.toString()}>
                                                                {party.party_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Actions */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border">
                                        {/* Action Icons */}
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-2 h-auto text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                                onClick={() => imageInputRef.current?.click()}
                                                disabled={uploadedImages.length >= 4}
                                            >
                                                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="ml-1 text-xs sm:text-sm hidden sm:inline">Image</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-2 h-auto text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                                                onClick={() => videoInputRef.current?.click()}
                                                disabled={uploadedVideos.length >= 2}
                                            >
                                                <VideoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span className="ml-1 text-xs sm:text-sm hidden sm:inline">Video</span>
                                            </Button>
                                        </div>

                                        {/* Character Count and Post Button */}
                                        <div className="flex items-center justify-between sm:justify-end gap-3">
                                            {postText.length > 0 && (
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    {500 - postText.length} characters left
                                                </div>
                                            )}
                                            <Button
                                                onClick={handlePost}
                                                disabled={!postText.trim() || isPosting}
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 sm:px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                            >
                                                {isPosting ? 'Posting...' : 'Post'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hidden File Inputs */}
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideoUpload}
                            className="hidden"
                        />

                    </section>


                    {/* Right Section - 30% */}
                    <section className="hidden xl:block w-[26%] bg-background p-4 fixed right-4 h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


                    </section>
                </>


                {/* Modals and Sidebar */}
                <SearchQueryDialog
                    searchQueryModal={searchQueryModal}
                    setSearchQueryModal={setSearchQueryModal}
                    searchCategories={searchCategories}
                    activeSearchCategory={activeSearchCategory}
                    setActiveSearchCategory={setActiveSearchCategory}
                />

                <NotificationsDialog
                    notificationsModal={notificationsModal}
                    setNotificationsModal={setNotificationsModal}
                    notificationCategories={notificationCategories}
                    activeNotificationCategory={activeNotificationCategory}
                    setActiveNotificationCategory={setActiveNotificationCategory}
                />

                <UserSidebar
                    isOpen={isUserSidebarOpen}
                    onClose={() => setIsUserSidebarOpen(false)}
                />
            </main>
        </div>
    )
}