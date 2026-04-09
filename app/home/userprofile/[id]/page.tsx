'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Share, ArrowBigUp, ArrowBigDown, MessageCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, UserCircleIcon, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { UserSidebar } from '@/components/HomePage/userSidebar';
import { useAppSelector } from '@/redux/hooks';
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandThreads, IconBrandTiktok, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { InstagramCarousel } from '@/components/ui/instagram-carousel';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { NotificationsDialog } from '@/components/PodcastsPage/notificationsDialog';
import { SearchQueryDialog } from '@/components/PodcastsPage/searchQueryDialog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

const searchCategories = ['All', 'Polical Parties', 'Leaders'];
const notificationCategories = ['All'];

interface User {
    id: number;
    username: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    [key: string]: unknown;
}

interface MediaDataItem {
    data?: string;
}

interface PostCommentPreview {
    id?: string | number;
    profile_picture?: string;
    full_name?: string;
    username?: string;
    content?: string;
    text?: string;
    created_at?: string;
    timestamp?: string | number;
}

interface Post {
    id: number;
    user: User;
    username: string;
    profile_picture: string;
    content: string;
    images: MediaDataItem[];
    videos: MediaDataItem[];
    is_anonymous: boolean;
    created_at: string;
    upvotes: number;
    downvotes: number;
    comments: PostCommentPreview[];
}

interface ProfileUser {
    id: number | null;
    username: string;
    fullName: string | null;
    profilePicture: string | null;
    bio: string | null;
    userFacebook: string | null;
    userInstagram: string | null;
    userXTwitter: string | null;
    userThreads: string | null;
    userYouTube: string | null;
    userLinkedIn: string | null;
    userTikTok: string | null;
}

function mapApiProfileToDisplay(api: Record<string, unknown>): ProfileUser {
    return {
        id: (api.id as number) ?? null,
        username: (api.username as string) ?? '',
        fullName: (api.full_name as string) ?? null,
        profilePicture: (api.profile_picture as string) ?? null,
        bio: (api.bio as string) ?? null,
        userFacebook: (api.user_facebook as string) ?? null,
        userInstagram: (api.user_instagram as string) ?? null,
        userXTwitter: (api.user_x_twitter as string) ?? null,
        userThreads: (api.user_threads as string) ?? null,
        userYouTube: (api.user_youtube as string) ?? null,
        userLinkedIn: (api.user_linkedin as string) ?? null,
        userTikTok: (api.user_tiktok as string) ?? null,
    };
}

const getUserDisplayName = (user: User): string => {
    if (user.full_name && String(user.full_name).trim()) return user.full_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`.trim();
    if (user.first_name) return user.first_name;
    return user.username;
};

const getUserProfilePicture = (user: User): string => {
    if (user.profile_picture && String(user.profile_picture).trim()) return user.profile_picture;
    return `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`;
};

const upvotePost = async (postId: number): Promise<{ new_upvotes: number; action: string }> => {
    const response = await fetch(`${API_BASE_URL}/somaapp/upvote-post/${postId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { new_upvotes: data.new_upvotes, action: data.action };
};

const downvotePost = async (postId: number): Promise<{ new_downvotes: number; action: string }> => {
    const response = await fetch(`${API_BASE_URL}/somaapp/downvote-post/${postId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return { new_downvotes: data.new_downvotes, action: data.action };
};

export default function UserProfileByIdPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const userId = id ? parseInt(id, 10) : NaN;
    const isIdValid = !isNaN(userId) && userId > 0;

    const [mounted, setMounted] = useState(false);
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState('All');
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState('All');
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
    const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
    const [selectedPostForComment, setSelectedPostForComment] = useState<Post | null>(null);
    const [commentText, setCommentText] = useState('');
    const [votingState, setVotingState] = useState<{ [key: number]: 'upvoted' | 'downvoted' | null }>({});
    const [votingLoading, setVotingLoading] = useState<{ [key: number]: boolean }>({});
    const commentsListRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const currentUser = useAppSelector((state) => state.user);
    const queryClient = useQueryClient();
    const isOwnProfile = currentUser?.id != null && currentUser.id === userId;

    const {
        data: profileData,
        isLoading: isLoadingProfile,
        isError: isProfileError,
        error: profileError,
    } = useQuery({
        queryKey: ['user-profile', userId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/somaapp/get-user-profile/${userId}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (!res.ok) {
                if (res.status === 404) throw new Error('User not found');
                const text = await res.text();
                throw new Error(text || `HTTP ${res.status}`);
            }
            const data = await res.json();
            return mapApiProfileToDisplay(data);
        },
        enabled: isIdValid,
    });

    const fetchUserPostsPage = async ({ pageParam = 1 }: { pageParam?: number }) => {
        const res = await fetch(`${API_BASE_URL}/somaapp/get-user-posts/${userId}/?page=${pageParam}&limit=5`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return {
            posts: data.posts as Post[],
            nextPage: data.has_next ? pageParam + 1 : null,
            hasNextPage: !!data.has_next,
        };
    };

    const {
        data: postsData,
        fetchNextPage: fetchNextPosts,
        hasNextPage: hasNextPosts,
        isFetchingNextPage: isFetchingNextPosts,
        isLoading: isLoadingPosts,
        isError: isPostsError,
    } = useInfiniteQuery({
        queryKey: ['user-posts', userId],
        queryFn: fetchUserPostsPage,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
        enabled: isIdValid && !!profileData,
    });

    const posts = postsData?.pages.flatMap((p) => p.posts) ?? [];

    const sharePost = async (postId: number) => {
        const postUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${postId}`;
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(postUrl);
                toast.success('Post link copied to clipboard!');
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = postUrl;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                toast.success('Post link copied to clipboard!');
            }
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleUpvote = async (postId: number) => {
        try {
            setVotingLoading((prev) => ({ ...prev, [postId]: true }));
            setVotingState((prev) => ({ ...prev, [postId]: prev[postId] === 'upvoted' ? null : 'upvoted' }));
            await upvotePost(postId);
            await queryClient.invalidateQueries({ queryKey: ['user-posts', userId] });
        } catch {
            setVotingState((prev) => ({ ...prev, [postId]: prev[postId] === 'upvoted' ? 'upvoted' : null }));
        } finally {
            setVotingLoading((prev) => ({ ...prev, [postId]: false }));
        }
    };

    const handleDownvote = async (postId: number) => {
        try {
            setVotingLoading((prev) => ({ ...prev, [postId]: true }));
            setVotingState((prev) => ({ ...prev, [postId]: prev[postId] === 'downvoted' ? null : 'downvoted' }));
            await downvotePost(postId);
            await queryClient.invalidateQueries({ queryKey: ['user-posts', userId] });
        } catch {
            setVotingState((prev) => ({ ...prev, [postId]: prev[postId] === 'downvoted' ? 'downvoted' : null }));
        } finally {
            setVotingLoading((prev) => ({ ...prev, [postId]: false }));
        }
    };

    const handleComment = (post: Post) => {
        setSelectedPostForComment(post);
        setCommentDrawerOpen(true);
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !selectedPostForComment) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') || '' : '';
        try {
            const response = await fetch(`${API_BASE_URL}/somaapp/comment-post/${selectedPostForComment.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({ comment: commentText.trim() }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.comment) {
                    setSelectedPostForComment((prev) =>
                        prev ? { ...prev, comments: [...(prev.comments || []), data.comment] } : null
                    );
                }
                setCommentText('');
                await queryClient.invalidateQueries({ queryKey: ['user-posts', userId] });
                setTimeout(() => {
                    if (commentsListRef.current) commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
                }, 100);
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
        }
    };

    useEffect(() => setMounted(true), []);

    if (!isIdValid) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center p-6 font-comfortaa">
                <p className="text-muted-foreground">Invalid profile.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/home')}>
                    Go to Home
                </Button>
            </div>
        );
    }

    if (isProfileError) {
        const is404 = profileError?.message === 'User not found';
        return (
            <div className="flex flex-col min-h-screen items-center justify-center p-6 font-comfortaa">
                <p className="text-muted-foreground">{is404 ? 'User not found' : 'Failed to load profile.'}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push('/home')}>
                    Go to Home
                </Button>
            </div>
        );
    }

    const profile = profileData;

    return (
        <div className="flex flex-col min-h-screen font-comfortaa">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">
                    {typeof window !== 'undefined' && window.innerWidth > 639 ? (
                        <div>
                            <img
                                src={theme === 'dark' ? '/icons8-light-box-800.png' : '/icons8-box-800.png'}
                                alt="CampusPoll logo"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                    ) : (
                        <UserCircleIcon
                            className="h-6 w-6 text-primary cursor-pointer"
                            onClick={() => setIsUserSidebarOpen(true)}
                        />
                    )}
                    {typeof window !== 'undefined' && window.innerWidth >= 500 ? (
                        <div className="flex-1 max-w-xl mx-2 bg-background">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full placeholder:hidden md:placeholder:block"
                                    onClick={() =>
                                        typeof window !== 'undefined' && window.innerWidth < 600
                                            ? router.push('/home/search')
                                            : setSearchQueryModal(true)
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <Link href="/home/search" className="ml-auto mr-2">
                            <Search className="h-4 w-4 text-primary" />
                        </Link>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                            onClick={() =>
                                typeof window !== 'undefined' && window.innerWidth >= 768
                                    ? setNotificationsModal(true)
                                    : router.push('/home/notifications')
                            }
                        >
                            <Bell className="h-6 w-6" />
                        </Button>
                        {mounted && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="cursor-pointer">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 cursor-pointer" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 cursor-pointer" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background">
                                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 mt-[8rem] bg-background">
                <section className="rounded-lg m-2 w-full xl:w-[50%] xl:mx-auto bg-background p-2 sm:p-6 md:p-8 xl:p-10 overflow-y-auto">
                    {isLoadingProfile || !profile ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col w-full h-full">
                                    <div className="flex flex-row align-center justify-between">
                                        <div className="flex flex-col">
                                            <h1 className="text-3xl font-bold">{profile.fullName || profile.username}</h1>
                                            <p className="text-gray-500 text-md">@{profile.username}</p>
                                        </div>
                                        <div className="relative">
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-blue-500">
                                                {profile.profilePicture ? (
                                                    <Image
                                                        src={profile.profilePicture}
                                                        alt={`${profile.fullName || profile.username}'s profile`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex flex-row bg-blue-50 dark:bg-blue-900/20 text-blue-500 items-center justify-center text-5xl font-bold h-full w-full">
                                                        {profile.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full h-full pr-2 py-2">
                                        <p className="text-gray-500 text-sm">{profile.bio ?? ' '}</p>
                                    </div>
                                    <div className="flex flex-row align-center justify-start w-full h-full pr-2 gap-2">
                                        {profile.userFacebook && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50"
                                                onClick={() => profile.userFacebook && window.open(profile.userFacebook, '_blank')}
                                            >
                                                <IconBrandFacebook className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        )}
                                        {profile.userInstagram && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-pink-50"
                                                onClick={() =>
                                                    profile.userInstagram && window.open(`https://instagram.com/${profile.userInstagram}`, '_blank')
                                                }
                                            >
                                                <IconBrandInstagram className="h-4 w-4 text-pink-600" />
                                            </Button>
                                        )}
                                        {profile.userXTwitter && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-black/5"
                                                onClick={() =>
                                                    profile.userXTwitter && window.open(`https://x.com/${profile.userXTwitter}`, '_blank')
                                                }
                                            >
                                                <IconBrandX className="h-4 w-4 text-black" />
                                            </Button>
                                        )}
                                        {profile.userThreads && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-black/5"
                                                onClick={() =>
                                                    profile.userThreads && window.open(`https://threads.net/@${profile.userThreads}`, '_blank')
                                                }
                                            >
                                                <IconBrandThreads className="h-4 w-4 text-black" />
                                            </Button>
                                        )}
                                        {profile.userYouTube && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-50"
                                                onClick={() => profile.userYouTube && window.open(profile.userYouTube, '_blank')}
                                            >
                                                <IconBrandYoutube className="h-4 w-4 text-red-600" />
                                            </Button>
                                        )}
                                        {profile.userLinkedIn && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50"
                                                onClick={() =>
                                                    profile.userLinkedIn && window.open(profile.userLinkedIn, '_blank')
                                                }
                                            >
                                                <IconBrandLinkedin className="h-4 w-4 text-blue-700" />
                                            </Button>
                                        )}
                                        {profile.userTikTok && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-black/5"
                                                onClick={() =>
                                                    profile.userTikTok && window.open(`https://tiktok.com/@${profile.userTikTok}`, '_blank')
                                                }
                                            >
                                                <IconBrandTiktok className="h-4 w-4 text-black" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6">
                                {isOwnProfile && (
                                    <>
                                        <Button
                                            onClick={() => router.push('/home/add')}
                                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                            New Post
                                        </Button>
                                        <Link href="/home/userprofile/edit-profile">
                                            <Button variant="outline" className="cursor-pointer">
                                                Edit Profile
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="cursor-pointer">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Share Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Report</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <Tabs defaultValue="activity" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="activity"
                                        className="data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-primary dark:data-[state=active]:bg-primary"
                                    >
                                        Activity
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="events"
                                        className="data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-primary dark:data-[state=active]:bg-primary"
                                    >
                                        Events
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="activity" className="mt-4">
                                    <div className="space-y-4">
                                        {isLoadingPosts ? (
                                            <div className="space-y-4">
                                                {[...Array(2)].map((_, i) => (
                                                    <div key={i} className="bg-background rounded-xl border shadow-sm animate-pulse p-4">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                                                            <div className="space-y-1">
                                                                <div className="h-4 bg-gray-300 rounded w-32" />
                                                                <div className="h-3 bg-gray-300 rounded w-24" />
                                                            </div>
                                                        </div>
                                                        <div className="h-4 bg-gray-300 rounded w-full mb-2" />
                                                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : isPostsError ? (
                                            <div className="text-center py-8">
                                                <p className="text-red-500 text-sm">Failed to load posts.</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2"
                                                    onClick={() => queryClient.invalidateQueries({ queryKey: ['user-posts', userId] })}
                                                >
                                                    Retry
                                                </Button>
                                            </div>
                                        ) : posts.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground text-sm">No posts yet</p>
                                                <p className="text-muted-foreground text-xs mt-1">Non-anonymous posts will appear here.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="space-y-4">
                                                    {posts.map((post) => {
                                                        const extractAndCategorizeMedia = (mediaArray: MediaDataItem[]) => {
                                                            if (!mediaArray || !Array.isArray(mediaArray))
                                                                return { images: [] as string[], videos: [] as string[] };
                                                            const images: string[] = [];
                                                            const videos: string[] = [];
                                                            mediaArray.forEach((item: MediaDataItem) => {
                                                                if (
                                                                    item?.data &&
                                                                    typeof item.data === 'string' &&
                                                                    item.data.startsWith('data:')
                                                                ) {
                                                                    const mime = item.data.split(';')[0].split(':')[1];
                                                                    if (mime?.startsWith('image/')) images.push(item.data);
                                                                    else if (mime?.startsWith('video/'))
                                                                        videos.push(item.data);
                                                                }
                                                            });
                                                            return { images, videos };
                                                        };
                                                        const { images: imageUrls, videos: videoUrls } =
                                                            extractAndCategorizeMedia(post.images ?? []);
                                                        const { images: videoImageUrls, videos: videoVideoUrls } =
                                                            extractAndCategorizeMedia(post.videos ?? []);
                                                        const combinedMedia = [
                                                            ...imageUrls,
                                                            ...videoImageUrls,
                                                            ...videoUrls,
                                                            ...videoVideoUrls,
                                                        ];
                                                        return (
                                                            <motion.article
                                                                key={post.id}
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className="bg-background rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                                                onClick={() => router.push(`/post/${post.id}`)}
                                                            >
                                                                <div className="flex items-center justify-between p-4 pb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-full overflow-hidden">
                                                                            {post.user?.profile_picture ? (
                                                                                <Image
                                                                                    src={getUserProfilePicture(post.user)}
                                                                                    alt={getUserDisplayName(post.user)}
                                                                                    width={40}
                                                                                    height={40}
                                                                                    className="object-cover"
                                                                                    onError={(e) => {
                                                                                        e.currentTarget.style.display = 'none';
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-lg">
                                                                                    {getUserDisplayName(post.user).charAt(0).toUpperCase()}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-semibold text-primary">
                                                                                {getUserDisplayName(post.user)}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">@{post.username}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(post.created_at).toLocaleDateString()}
                                                                        </span>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <button
                                                                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                >
                                                                                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                                                                </button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-48">
                                                                                <DropdownMenuItem
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        sharePost(post.id);
                                                                                    }}
                                                                                    className="cursor-pointer"
                                                                                >
                                                                                    <Share className="w-4 h-4 mr-2" />
                                                                                    Share Post
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                                <div className="px-4 pb-3">
                                                                    <p className="text-sm text-primary leading-relaxed mb-3">
                                                                        {post.content}
                                                                    </p>
                                                                </div>
                                                                {combinedMedia.length > 0 && (
                                                                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                                                                        <InstagramCarousel
                                                                            images={combinedMedia}
                                                                            alt={`Post by ${getUserDisplayName(post.user)}`}
                                                                        />
                                                                    </div>
                                                                )}
                                                                <div
                                                                    className="px-4 py-3 border-t border-gray-100"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <div className="flex items-center gap-6">
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                className={`flex items-center gap-1 transition-all duration-200 p-1 rounded ${
                                                                                    votingState[post.id] === 'upvoted'
                                                                                        ? 'text-green-600 bg-green-100'
                                                                                        : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                                                                                } ${votingLoading[post.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                onClick={() =>
                                                                                    !votingLoading[post.id] && handleUpvote(post.id)
                                                                                }
                                                                                title="Upvote"
                                                                                disabled={!!votingLoading[post.id]}
                                                                            >
                                                                                <ArrowBigUp
                                                                                    className={`w-4 h-4 ${votingLoading[post.id] ? 'animate-pulse' : ''}`}
                                                                                />
                                                                            </button>
                                                                            <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
                                                                                {post.upvotes ?? 0}
                                                                            </span>
                                                                            <button
                                                                                className={`flex items-center gap-1 transition-all duration-200 p-1 rounded ${
                                                                                    votingState[post.id] === 'downvoted'
                                                                                        ? 'text-red-600 bg-red-100'
                                                                                        : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                                                                } ${votingLoading[post.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                                onClick={() =>
                                                                                    !votingLoading[post.id] && handleDownvote(post.id)
                                                                                }
                                                                                title="Downvote"
                                                                                disabled={!!votingLoading[post.id]}
                                                                            >
                                                                                <ArrowBigDown
                                                                                    className={`w-4 h-4 ${votingLoading[post.id] ? 'animate-pulse' : ''}`}
                                                                                />
                                                                            </button>
                                                                            <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
                                                                                {post.downvotes ?? 0}
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 p-1 rounded"
                                                                            onClick={() => handleComment(post)}
                                                                            title="Comment"
                                                                        >
                                                                            <MessageCircle className="w-5 h-5" />
                                                                            <span className="text-sm font-medium text-gray-700">
                                                                                {post.comments?.length ?? 0}
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </motion.article>
                                                        );
                                                    })}
                                                </div>
                                                {hasNextPosts && (
                                                    <div className="flex justify-center py-6">
                                                        <Button
                                                            onClick={() => fetchNextPosts()}
                                                            disabled={isFetchingNextPosts}
                                                            variant="outline"
                                                            className="px-6"
                                                        >
                                                            {isFetchingNextPosts ? (
                                                                <>
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2" />
                                                                    Loading...
                                                                </>
                                                            ) : (
                                                                'Load More Posts'
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="events" className="mt-4">
                                    <div className="space-y-4">
                                        <p>User events will be displayed here</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </section>
            </main>

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
            <UserSidebar isOpen={isUserSidebarOpen} onClose={() => setIsUserSidebarOpen(false)} />

            <Drawer
                open={commentDrawerOpen}
                onOpenChange={(open) => {
                    setCommentDrawerOpen(open);
                    if (!open) {
                        setCommentText('');
                        setSelectedPostForComment(null);
                    }
                }}
            >
                <DrawerContent className="h-[100vh] max-h-[100vh]">
                    <div className="mx-auto w-full max-w-2xl h-full flex flex-col">
                        <DrawerHeader>
                            <DrawerTitle>Comments</DrawerTitle>
                            <DrawerDescription>
                                {selectedPostForComment ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                            {selectedPostForComment.user?.profile_picture ? (
                                                <Image
                                                    src={getUserProfilePicture(selectedPostForComment.user)}
                                                    alt={getUserDisplayName(selectedPostForComment.user)}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-sm">
                                                    {getUserDisplayName(selectedPostForComment.user).charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-primary">
                                                {getUserDisplayName(selectedPostForComment.user)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {selectedPostForComment.content.length > 50
                                                    ? selectedPostForComment.content.substring(0, 50) + '...'
                                                    : selectedPostForComment.content}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    'View and add comments to this post'
                                )}
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4 pb-0 flex-1 flex flex-col min-h-0">
                            <div ref={commentsListRef} className="space-y-4 flex-1 overflow-y-auto min-h-0 pr-2">
                                {selectedPostForComment?.comments && selectedPostForComment.comments.length > 0 ? (
                                    selectedPostForComment.comments.map((comment: PostCommentPreview, index: number) => (
                                        <div
                                            key={comment.id ?? index}
                                            className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                        >
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                                {comment.profile_picture ? (
                                                    <Image
                                                        src={
                                                            comment.profile_picture.startsWith('data:')
                                                                ? comment.profile_picture
                                                                : `data:image/jpeg;base64,${comment.profile_picture}`
                                                        }
                                                        alt={comment.full_name || comment.username || 'User'}
                                                        width={32}
                                                        height={32}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-sm">
                                                        {(comment.full_name || comment.username || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-primary">
                                                        {comment.full_name || comment.username || 'Anonymous'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {comment.timestamp
                                                            ? new Date(comment.timestamp).toLocaleDateString()
                                                            : 'Just now'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No comments yet</p>
                                        <p className="text-xs text-gray-400">Be the first to comment!</p>
                                    </div>
                                )}
                            </div>
                            {currentUser?.id && (
                                <div className="mt-6 p-4 bg-background rounded-lg flex-shrink-0">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-blue-500 font-semibold text-sm">
                                            {currentUser.fullName
                                                ? currentUser.fullName.charAt(0).toUpperCase()
                                                : currentUser.username?.charAt(0).toUpperCase() ?? '?'}
                                        </div>
                                        <div className="flex-1">
                                            <textarea
                                                placeholder="Write a comment..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                            <div className="flex justify-end mt-3">
                                                <Button
                                                    size="sm"
                                                    className="px-6"
                                                    onClick={handleSubmitComment}
                                                    disabled={!commentText.trim()}
                                                >
                                                    Post Comment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DrawerFooter className="flex-shrink-0">
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            <Toaster />
        </div>
    );
}
