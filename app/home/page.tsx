"use client";

// Imports
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, Plus, Mail, Bell, Pen, Mic, Book, Compass, Search, UserCircleIcon, ChevronDown, Heart, MessageCircle, Repeat2, Bookmark, MoreHorizontal, ArrowUp, ArrowDown, ArrowBigUp, ArrowBigDown, Share } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog2, DialogContent2, DialogHeader2, DialogTitle2 } from "@/components/HomePage/dialog2";
import { WriterDetailsSheet } from "@/components/HomePage/writerDetailsSheet";
import { PublicationDetailsSheet } from "@/components/HomePage/publicationDetailsSheet";
import { CreateContentDialog } from "@/components/HomePage/createContentDialog";
import { SearchQueryDialog } from "@/components/HomePage/searchQueryDialog";
import { NotificationsDialog } from "@/components/HomePage/notificationsDialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import * as React from "react";
import { Moon, Sun, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useAuth } from '../../context/auth-context';
import { useAppSelector } from "@/redux/hooks";
import useWindowSize from "@/hooks/useWindow";
import { useRouter } from "next/navigation";
import { UserSidebar } from "@/components/HomePage/userSidebar";
import { InstagramCarousel } from "@/components/ui/instagram-carousel";
import { useInfiniteQuery } from '@tanstack/react-query';

// API base URL - adjust according to your backend setup
const API_BASE_URL = 'http://localhost:8000';

// Interface for User data from backend
interface User {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    candidate: boolean;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    bio?: string;
    privacy_settings: string;
    user_facebook?: string;
    user_instagram?: string;
    user_x_twitter?: string;
    user_threads?: string;
    user_youtube?: string;
    user_linkedin?: string;
    user_tiktok?: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    last_login?: string;
    created_at: string;
    updated_at: string;
}

// Interface for Candidate data from backend
interface Candidate {
    id: number;
    candidate_name: string;
    manifesto?: string;
    votes: number;
    supporters: unknown[];
    supporters_count: number;
    department?: string;
    structure?: string;
    profile_picture?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    x?: string;
    threads?: string;
}

// Interface for API response
interface GetUsersResponse {
    message: string;
    users: User[];
}

// Interface for Candidates API response
interface GetCandidatesResponse {
    message: string;
    candidates: Candidate[];
    count: number;
}

// Interface for Post data from backend
interface PostComment {
    id?: string | number;
    profile_picture?: string;
    full_name?: string;
    username?: string;
    content?: string;
    text?: string;
    timestamp?: string | number;
}

type PostMediaItem = string | { data?: string };

interface Post {
    id: number;
    user: User;
    username: string;
    profile_picture: string;
    content: string;
    images: PostMediaItem[];
    videos: PostMediaItem[];
    is_anonymous: boolean;
    user_data: {
        username: string;
        email: string;
        fullName: string;
        profilePicture: string;
    };
    created_at: string;
    updated_at: string;
    upvotes: number;
    downvotes: number;
    comments: PostComment[];
    parties?: Party[];
}

// Interface for Posts API response
interface GetPostsResponse {
    message: string;
    posts: Post[];
    count: number;
    total?: number;
    has_next?: boolean;
    has_previous?: boolean;
    page?: number;
    limit?: number;
    next?: string | null;
    previous?: string | null;
}

// Interface for Party data from backend
interface Party {
    id: number;
    party_name: string;
    manifesto?: string;
    votes: number;
    supporters: unknown[];
    supporters_count: number;
    party_leader?: string;
    structure?: string;
    logo?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    x?: string;
    threads?: string;
}

// Interface for Parties API response
interface GetPartiesResponse {
    message: string;
    parties: Party[];
    count: number;
}

// // Function to fetch all users from backend
// const fetchAllUsers = async (): Promise<User[]> => {
//     try {
//         console.log('🔄 Fetching users from:', `${API_BASE_URL}/somaapp/get-all-users/`);

//         const response = await fetch(`${API_BASE_URL}/somaapp/get-all-users/`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include', // Include cookies for authentication if needed
//         });

//         console.log('📡 Response status:', response.status);
//         console.log('📡 Response ok:', response.ok);

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('❌ Response error:', errorText);
//             throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
//         }

//         const data: GetUsersResponse = await response.json();
//         console.log('✅ Users fetched successfully:', data);
//         console.log('👥 Number of users:', data.users.length);

//         return data.users;
//     } catch (error) {
//         console.error('❌ Error fetching users:', error);
//         throw error;
//     }
// };

// Function to fetch all candidates from backend
const fetchAllCandidates = async (): Promise<Candidate[]> => {
    try {
        // console.log('🔄 Fetching candidates from:', `${API_BASE_URL}/somaapp/get-all-candidates/`);

        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-candidates/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication if needed
        });

        // console.log('📡 Response status:', response.status);
        // console.log('📡 Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            // console.error('❌ Response error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data: GetCandidatesResponse = await response.json();
        // console.log('✅ Candidates fetched successfully:', data);
        // console.log('👥 Number of candidates:', data.candidates.length);

        return data.candidates;
    } catch (error) {
        // console.error('❌ Error fetching candidates:', error);
        throw error;
    }
};

// // Function to fetch all posts from backend
// const fetchAllPosts = async (): Promise<Post[]> => {
//     try {
//         console.log('🔄 Fetching posts from:', `${API_BASE_URL}/somaapp/get-all-posts/`);

//         const response = await fetch(`${API_BASE_URL}/somaapp/get-all-posts/`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             credentials: 'include', // Include cookies for authentication if needed
//         });

//         console.log('📡 Posts response status:', response.status);
//         console.log('📡 Posts response ok:', response.ok);

//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error('❌ Posts response error:', errorText);
//             throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
//         }

//         const data: GetPostsResponse = await response.json();
//         console.log('✅ Posts fetched successfully:', data);
//         console.log('📝 Number of posts:', data.posts.length);

//         // Debug: Log the first post's structure to see what we're working with
//         if (data.posts.length > 0) {
//             const firstPost = data.posts[0];
//             console.log('🔍 First post structure:', {
//                 id: firstPost.id,
//                 content: firstPost.content,
//                 images: firstPost.images,
//                 videos: firstPost.videos,
//                 imagesType: typeof firstPost.images,
//                 videosType: typeof firstPost.videos,
//                 imagesLength: firstPost.images ? firstPost.images.length : 'undefined',
//                 videosLength: firstPost.videos ? firstPost.videos.length : 'undefined'
//             });

//             // Check if images/videos are actually arrays
//             if (firstPost.images) {
//                 console.log('📸 Images array check:', {
//                     isArray: Array.isArray(firstPost.images),
//                     firstImage: firstPost.images[0],
//                     firstImageType: typeof firstPost.images[0]
//                 });
//             }

//             if (firstPost.videos) {
//                 console.log('🎥 Videos array check:', {
//                     isArray: Array.isArray(firstPost.videos),
//                     firstVideo: firstPost.videos[0],
//                     firstVideoType: typeof firstPost.videos[0]
//                 });
//             }
//         }

//         return data.posts;
//     } catch (error) {
//         console.error('❌ Error fetching posts:', error);
//         throw error;
//     }
// };

// Function to fetch posts with pagination for infinite scrolling
const fetchPostsPage = async ({ pageParam = 1 }: { pageParam?: number }): Promise<{ posts: Post[]; nextPage: number | null; hasNextPage: boolean }> => {
    try {
        console.log('🔄 Fetching posts page:', pageParam, 'from:', `${API_BASE_URL}/somaapp/get-all-posts/?page=${pageParam}&limit=5`);

        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-posts/?page=${pageParam}&limit=5`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication if needed
        });

        console.log('📡 Posts page response status:', response.status);
        console.log('📡 Posts page response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Posts page response error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data: GetPostsResponse = await response.json();
        console.log('✅ Posts page fetched successfully:', data);
        console.log('📝 Number of posts in page:', data.posts.length);

        // Check if there are more pages based on the response
        const hasNextPage = data.has_next || false; // Use backend's pagination info
        const nextPage = hasNextPage ? pageParam + 1 : null;

        console.log('📝 Has Next Page:', hasNextPage);
        console.log('📝 Next Page:', nextPage);

        console.log('📝 Posts:', data.posts);

        return {
            posts: data.posts,
            nextPage,
            hasNextPage
        };
    } catch (error) {
        console.error('❌ Error fetching posts page:', error);
        throw error;
    }
};

// Function to fetch newer posts (for pull-to-refresh)
const fetchNewerPosts = async (): Promise<Post[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-posts/?page=1&limit=20`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data: GetPostsResponse = await response.json();
        return data.posts;
    } catch (error) {
        console.error('Error fetching newer posts:', error);
        throw error;
    }
};

// Function to fetch all parties from backend
const fetchAllParties = async (): Promise<Party[]> => {
    try {
        // console.log('🔄 Fetching parties from:', `${API_BASE_URL}/somaapp/get-all-parties/`);

        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-parties/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication if needed
        });

        if (!response.ok) {
            const errorText = await response.text();
            // console.error('❌ HTTP Error:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data: GetPartiesResponse = await response.json();
        // console.log('✅ Raw parties response:', data);

        if (!data.parties || !Array.isArray(data.parties)) {
            // console.error('❌ Invalid parties data structure:', data);
            throw new Error('Invalid response structure: parties not found or not an array');
        }

        // console.log('✅ Parties fetched successfully:', data.parties.length, 'parties');
        return data.parties;
    } catch (error) {
        // console.error('❌ Error fetching parties:', error);
        throw error;
    }
};

// Function to upvote a post
const upvotePost = async (postId: number): Promise<{ new_upvotes: number; action: string }> => {
    try {
        console.log('👍 Upvoting post:', postId);

        const response = await fetch(`${API_BASE_URL}/somaapp/upvote-post/${postId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Upvote successful:', data);

        return {
            new_upvotes: data.new_upvotes,
            action: data.action
        };
    } catch (error) {
        console.error('❌ Error upvoting post:', error);
        throw error;
    }
};

// Function to downvote a post
const downvotePost = async (postId: number): Promise<{ new_downvotes: number; action: string }> => {
    try {
        console.log('👎 Downvoting post:', postId);

        const response = await fetch(`${API_BASE_URL}/somaapp/downvote-post/${postId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Downvote successful:', data);

        return {
            new_downvotes: data.new_downvotes,
            action: data.action
        };
    } catch (error) {
        console.error('❌ Error downvoting post:', error);
        throw error;
    }
};

// Function to get user display name (fallback logic)
const getUserDisplayName = (user: User): string => {
    if (user.full_name && user.full_name.trim()) {
        return user.full_name;
    }
    if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`.trim();
    }
    if (user.first_name) {
        return user.first_name;
    }
    return user.username;
};

// Function to get user profile picture with fallback
const getUserProfilePicture = (user: User): string => {
    if (user.profile_picture && user.profile_picture.trim()) {
        return user.profile_picture;
    }
    // Return a default avatar or use Unsplash placeholder
    return `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`;
};

// Search Categories
const searchCategories = [
    "All",
    "Polical Parties",
    "Leaders",
]

const notificationCategories = [
    "All",
]





// Home Page Function
export default function HomePage() {

    // router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();
    const currentUser = useAppSelector((state) => state.user);

    // activeCategory useState()
    const [activeCategory, setActiveCategory] = useState("All");

    // mounted useState()
    const [mounted, setMounted] = useState(false);


    // Add new state for create modal()
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Search Query useState()
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    // scrollContainerRef useRef()
    const categoriesScrollRef = useRef<HTMLDivElement>(null);
    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const postsContainerRef = useRef<HTMLDivElement>(null);
    const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

    // setTheme useTheme()
    const { setTheme } = useTheme();

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // candidates state for fetched candidates from database
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
    const [candidatesError, setCandidatesError] = useState<string | null>(null);

    // Tab state for filtering candidates
    const [selectedTab, setSelectedTab] = useState<string>("all");

    // Tab state for filtering parties
    const [selectedPartyTab, setSelectedPartyTab] = useState<string>("all");

    // Function to filter candidates based on selected tab
    const getFilteredCandidates = () => {
        if (selectedTab === "all") return candidates;
        if (selectedTab === "alice") return candidates.filter(candidate => candidate.structure === "Alice SRC");
        if (selectedTab === "east-london") return candidates.filter(candidate => candidate.structure === "East London SRC");
        return candidates;
    };

    // Function to filter parties based on selected tab
    const getFilteredParties = () => {
        if (selectedPartyTab === "all") return parties;
        if (selectedPartyTab === "alice") return parties.filter(party => party.structure === "Alice SRC");
        if (selectedPartyTab === "east-london") return parties.filter(party => party.structure === "East London SRC");
        return parties;
    };

    // posts state for fetched posts from database
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);

    // parties state for fetched parties from database
    const [parties, setParties] = useState<Party[]>([]);
    const [isLoadingParties, setIsLoadingParties] = useState(true);
    const [partiesError, setPartiesError] = useState<string | null>(null);

    // voting state to track user interactions
    const [votingState, setVotingState] = useState<{ [key: number]: 'upvoted' | 'downvoted' | null }>({});
    const [votingLoading, setVotingLoading] = useState<{ [key: number]: boolean }>({});

    // Pull-to-refresh state
    const [isLoadingNewerPosts, setIsLoadingNewerPosts] = useState(false);
    const [latestPostId, setLatestPostId] = useState<number | null>(null);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    // comment drawer state
    const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
    const [selectedPostForComment, setSelectedPostForComment] = useState<Post | null>(null);
    const [commentText, setCommentText] = useState('');
    const commentsListRef = useRef<HTMLDivElement>(null);

    // scroll function
    const scroll = (direction: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            const scrollAmount = 200;
            const newScrollLeft =
                ref.current.scrollLeft +
                (direction === "left" ? -scrollAmount : scrollAmount);
            ref.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    // share post function
    const sharePost = async (postId: number) => {
        const postUrl = `${window.location.origin}/post/${postId}`;

        try {
            // Try to use the modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(postUrl);
                toast.success("Post link copied to clipboard!", {
                    description: "Share this link with others to let them view this post.",
                });
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = postUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    toast.success("Post link copied to clipboard!", {
                        description: "Share this link with others to let them view this post.",
                    });
                } catch (error) {
                    console.error('Fallback: Oops, unable to copy', error);
                    toast.error("Failed to copy link", {
                        description: "Please try again or copy the URL manually.",
                    });
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (error) {
            console.error('Failed to copy post link:', error);
            toast.error("Failed to copy link", {
                description: "Please try again or copy the URL manually.",
            });
        }
    };

    // useWindowSize
    const { width } = useWindowSize();

    // Generate categories including party names
    const currentUserCategories = React.useMemo(() => {
        const baseCategories = ['All'];
        const partyCategories = parties.map(party => party.party_name);
        return [...baseCategories, ...partyCategories];
    }, [parties]);

    // Theme support
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize last scroll position
    useEffect(() => {
        if (postsContainerRef.current) {
            setLastScrollTop(postsContainerRef.current.scrollTop);
        }
    }, []);


    // Fetch posts using infinite query
    const {
        data: postsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingPostsQuery,
        error: postsErrorQuery,
        isError: isPostsError,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPostsPage,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
    });

    // Flatten the posts from all pages
    const postsFromQuery = postsData?.pages.flatMap(page => page.posts) || [];

    // Update loading state when query loading changes
    useEffect(() => {
        if (!isLoadingPostsQuery && !isFetchingNextPage) {
            setIsLoadingPosts(false);
        }
    }, [isLoadingPostsQuery, isFetchingNextPage]);

    // Handler for pull-to-refresh (scroll up to load newer posts)
    const handlePullToRefresh = async () => {
        if (isLoadingNewerPosts || isLoadingPostsQuery || displayIsLoadingPosts) {
            console.log('🚫 Pull-to-refresh blocked:', {
                isLoadingNewerPosts,
                isLoadingPostsQuery,
                displayIsLoadingPosts
            });
            return;
        }

        try {
            setIsLoadingNewerPosts(true);

            const newerPosts = await fetchNewerPosts();

            // Get current posts (either from query or local state)
            const currentPosts = postsFromQuery.length > 0 ? postsFromQuery : posts;

            if (newerPosts.length > 0) {
                // Filter out posts that we already have
                const existingPostIds = new Set(currentPosts.map(post => post.id));
                const trulyNewPosts = newerPosts.filter(post => !existingPostIds.has(post.id));

                if (trulyNewPosts.length > 0) {
                    // Update the latest post ID
                    setLatestPostId(Math.max(...trulyNewPosts.map(post => post.id)));

                    // Update posts based on data source
                    if (postsFromQuery.length === 0) {
                        // Using local state - prepend new posts
                        setPosts(prevPosts => [...trulyNewPosts, ...prevPosts]);
                    } else {
                        // Using React Query - update local posts as fallback
                        setPosts(prevPosts => [...trulyNewPosts, ...prevPosts]);
                    }
                }
            }
        } catch (error) {
            console.error('Error during pull-to-refresh:', error);
        } finally {
            setIsLoadingNewerPosts(false);
        }
    };

    // Use query data if available, otherwise fall back to state
    const displayPosts = postsFromQuery.length > 0 ? postsFromQuery : posts;
    const displayIsLoadingPosts = isLoadingPostsQuery || isLoadingPosts;
    const displayPostsError = postsErrorQuery || postsError;
    

    // Handler functions for voting
    const handleUpvote = async (postId: number) => {
        try {
            console.log('👍 Upvoting post:', postId);

            // Set loading state
            setVotingLoading(prev => ({ ...prev, [postId]: true }));

            // Update local voting state immediately for better UX
            setVotingState(prev => ({
                ...prev,
                [postId]: prev[postId] === 'upvoted' ? null : 'upvoted'
            }));

            // Make API call to update database
            const result = await upvotePost(postId);

            // Update the posts state with new upvote count
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, upvotes: result.new_upvotes }
                        : post
                )
            );

            console.log('✅ Upvote updated successfully:', result);

        } catch (error) {
            console.error('❌ Error upvoting post:', error);
            // Revert local state on error
            setVotingState(prev => ({
                ...prev,
                [postId]: prev[postId] === 'upvoted' ? 'upvoted' : null
            }));
            // You might want to show a toast notification here
        } finally {
            // Clear loading state
            setVotingLoading(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleDownvote = async (postId: number) => {
        try {
            console.log('👎 Downvoting post:', postId);

            // Set loading state
            setVotingLoading(prev => ({ ...prev, [postId]: true }));

            // Update local voting state immediately for better UX
            setVotingState(prev => ({
                ...prev,
                [postId]: prev[postId] === 'downvoted' ? null : 'downvoted'
            }));

            // Make API call to update database
            const result = await downvotePost(postId);

            // Update the posts state with new downvote count
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId
                        ? { ...post, downvotes: result.new_downvotes }
                        : post
                )
            );

            console.log('✅ Downvote updated successfully:', result);

        } catch (error) {
            console.error('❌ Error downvoting post:', error);
            // Revert local state on error
            setVotingState(prev => ({
                ...prev,
                [postId]: prev[postId] === 'downvoted' ? 'downvoted' : null
            }));
            // You might want to show a toast notification here
        } finally {
            // Clear loading state
            setVotingLoading(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleComment = (post: Post) => {
        console.log('💬 Commenting on post:', post.id);
        setSelectedPostForComment(post);
        setCommentDrawerOpen(true);
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim() || !selectedPostForComment) return;

        console.log('💬 Submitting comment:', {
            postId: selectedPostForComment.id,
            comment: commentText.trim()
        });

        try {
            const apiUrl = `${API_BASE_URL}/somaapp/comment-post/${selectedPostForComment.id}/`;
            console.log('🌐 Making comment API request to:', apiUrl);
            console.log('🔑 JWT Token:', localStorage.getItem('jwt_token') ? 'Present' : 'Missing');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt_token') || ''}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    comment: commentText.trim()
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Comment submitted successfully:', data);

                // Update the post with the new comment
                if (selectedPostForComment && data.comment) {
                    const updatedComments = [...(selectedPostForComment.comments || []), data.comment];
                    setSelectedPostForComment({
                        ...selectedPostForComment,
                        comments: updatedComments
                    });

                    // Also update the post in the main posts list
                    setPosts(prevPosts =>
                        prevPosts.map(post =>
                            post.id === selectedPostForComment.id
                                ? { ...post, comments: updatedComments }
                                : post
                        )
                    );
                }

                // Clear the comment input
                setCommentText('');

                // Auto-scroll to bottom of comments list
                setTimeout(() => {
                    if (commentsListRef.current) {
                        commentsListRef.current.scrollTop = commentsListRef.current.scrollHeight;
                    }
                }, 100);

                // Show success message (optional)
                console.log('Comment added successfully!');
            } else {
                console.error('❌ HTTP Error:', response.status, response.statusText);
                const responseText = await response.text();
                console.error('❌ Response body:', responseText);

                try {
                    const errorData = JSON.parse(responseText);
                    console.error('❌ Failed to submit comment:', errorData);
                } catch (e) {
                    console.error('❌ Response is not valid JSON:', responseText.substring(0, 200));
                }
                // You might want to show an error toast here
            }
        } catch (error) {
            console.error('❌ Error submitting comment:', error);
            // You might want to show an error toast here
        }
    };

    // Fetch candidates from the database
    useEffect(() => {
        const loadCandidates = async () => {
            try {
                // console.log('🚀 Starting to load candidates...');
                setIsLoadingCandidates(true);
                setCandidatesError(null);
                const fetchedCandidates = await fetchAllCandidates();
                // console.log('✅ Candidates loaded successfully:', fetchedCandidates);
                setCandidates(fetchedCandidates);
            } catch (error) {
                // console.error('❌ Error loading candidates:', error);
                setCandidatesError('Failed to load candidates. Please try again later.');
            } finally {
                setIsLoadingCandidates(false);
                // console.log('🔄 Loading complete');
            }
        };

        loadCandidates();
    }, []);

    // Fetch parties from the database
    useEffect(() => {
        const loadParties = async () => {
            try {
                // console.log('🚀 Starting to load parties...');
                setIsLoadingParties(true);
                setPartiesError(null);
                const fetchedParties = await fetchAllParties();
                // console.log('✅ Parties loaded successfully:', fetchedParties);
                setParties(fetchedParties);
            } catch (error) {
                // console.error('❌ Error loading parties:', error);
                setPartiesError('Failed to load parties. Please try again later.');
            } finally {
                setIsLoadingParties(false);
                // console.log('🔄 Parties loading complete');
            }
        };

        loadParties();
    }, []);

    // Infinite scroll using Intersection Observer
    useEffect(() => {
        console.log('🔄 Infinite scroll using Intersection Observer');
        console.log('📝 Has Next Page:', hasNextPage);
        console.log('📝 Is Fetching Next Page:', isFetchingNextPage);
        console.log('📝 Load More Trigger Ref:', loadMoreTriggerRef.current);
        if (!loadMoreTriggerRef.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                console.log('📝 Entries:', entries);
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    console.log('🔄 Auto-loading next page...');
                    fetchNextPage();
                }
            },
            {
                root: postsContainerRef.current,
                rootMargin: '100px', // Trigger 100px before the element is visible
                threshold: 0.1
            }
        );

        observer.observe(loadMoreTriggerRef.current);

        return () => {
            if (loadMoreTriggerRef.current) {
                observer.unobserve(loadMoreTriggerRef.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Pull-to-refresh scroll listener
    useEffect(() => {
        if (!postsContainerRef.current) return;

        const handleScroll = () => {
            const container = postsContainerRef.current;
            if (!container) return;

            const scrollTop = container.scrollTop;
            const threshold = 5; // Very small threshold - only trigger at the absolute top

            // Determine scroll direction
            const isScrollingUp = scrollTop < lastScrollTop;
            setLastScrollTop(scrollTop);

            // Only trigger pull-to-refresh when:
            // 1. At the very top (scrollTop <= threshold)
            // 2. Scrolling up (not down)
            // 3. Not currently loading
            // 4. User has scrolled down previously (to avoid triggering on page load)
            if (scrollTop <= threshold &&
                isScrollingUp &&
                !isLoadingNewerPosts &&
                !displayIsLoadingPosts &&
                lastScrollTop > threshold) {

                console.log('🔄 Pull-to-refresh triggered (scrolling up to top):', {
                    scrollTop,
                    lastScrollTop,
                    threshold,
                    isScrollingUp
                });
                handlePullToRefresh();
            }
        };

        const container = postsContainerRef.current;
        container.addEventListener('scroll', handleScroll);

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoadingNewerPosts, displayIsLoadingPosts, lastScrollTop]);


    // return
    return (
        <div className="flex flex-col min-h-screen bg-muted font-comfortaa">

            {/* Header */}
            <header className=" fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    {/* Left - SOMA (Company Logo) */}
                    {typeof window !== 'undefined' && window.innerWidth > 639 ? (
                        <div>
                            <img
                                src={
                                    theme === "dark"
                                        ? "/icons8-light-box-800.png"
                                        : "/icons8-box-800.png"
                                }
                                alt="CampusPoll logo"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                    ) : (
                        <div>
                            {currentUser.fullName ? (
                                <div
                                    onClick={() => setIsUserSidebarOpen(true)}
                                    className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold cursor-pointer text-xl"
                                >
                                    {currentUser.fullName.charAt(0).toUpperCase()}
                                </div>
                            ) : currentUser.profilePicture ? (
                                <img
                                    src={currentUser.profilePicture}
                                    alt="Profile"
                                    onClick={() => setIsUserSidebarOpen(true)}
                                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                                />
                            ) : (
                                <div
                                    onClick={() => setIsUserSidebarOpen(true)}
                                    className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold cursor-pointer"
                                >
                                    {currentUser.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Middle - Search Bar */}
                    {typeof window !== 'undefined' && window.innerWidth >= 500 ? (
                        <div className="flex-1 max-w-xl mx-2 bg-background">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full placeholder:hidden md:placeholder:block"
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.innerWidth < 600) {
                                            router.push("/home/search");
                                        } else {
                                            setSearchQueryModal(true);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <Link href="/home/search" className="ml-auto mr-2">
                            <Search className="h-6 w-6 text-primary" />
                        </Link>
                    )}


                    {/* Right - Buttons */}
                    <div className="flex items-center gap-2">

                        {/* Theme Toggle */}
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
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </header>


            {/* Categories Bar */}
            <div className="border-b fixed top-[4rem] left-0 right-0 z-40 bg-background">
                <div className="w-full relative bg-background">

                    {/* Left Arrow And Explore Button */}
                    <div className="absolute bg-background left-0 top-0 h-full  z-10 hover:from-background hover:via-background flex items-center justify-around gap-2 cursor-pointer">
                        <button
                            onClick={() => scroll("left", categoriesScrollRef)}
                            className="flex items-center justify-center cursor-pointer hidden md:block"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-primary" />
                        </button>
                    </div>

                    {/* Categories Container */}
                    <div
                        ref={categoriesScrollRef}
                        className="md:ml-10 flex items-center justify-start space-x-2 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4"
                    >
                        {currentUserCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category
                                    ? "text-primary-foreground bg-primary px-4 py-2 rounded-sm"
                                    : "text-primary bg-muted hover:text-primary hover:bg-muted px-4 py-2 rounded-sm"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll("right", categoriesScrollRef)}
                        className="hidden md:block cursor-pointer absolute right-0 top-0 h-full w-6 z-10 bg-gradient-to-l from-background via-background to-transparent hover:from-background hover:via-background flex items-center justify-center"
                    >
                        <ChevronRightIcon className="h-6 w-6 text-primary" />
                    </button>
                </div>
            </div>


            {/* Main Content */}
            <main className="flex-1 flex bg-muted mt-[8rem]">

                {/* Left Section - 20% */}
                <section className="hidden xl:block w-[20%] border-r bg-muted p-4 fixed h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* Popular Councillors Heading */}
                    <h2 className="text-lg font-semibold mb-4">Popular Councillors</h2>

                    {/* SRC Filter Tabs */}
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                            <TabsTrigger value="alice" className="text-xs">Alice</TabsTrigger>
                            <TabsTrigger value="east-london" className="text-xs">East London</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Loading State */}
                    {isLoadingCandidates && (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="bg-background rounded-lg p-3 shadow-sm animate-pulse">
                                    <div className="flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                                <div className="h-4 bg-gray-300 rounded w-24"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                                            <div className="h-7 bg-gray-300 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {candidatesError && (
                        <div className="text-center py-8">
                            <p className="text-red-500 text-sm mb-2">{candidatesError}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {/* Candidates Display */}
                    {!isLoadingCandidates && !candidatesError && (
                        <div className="space-y-3">
                            {getFilteredCandidates().length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground text-sm">
                                        {selectedTab === "all" ? "No Candidates found" :
                                         selectedTab === "alice" ? "No Alice SRC candidates found" :
                                         "No East London SRC candidates found"}
                                    </p>
                                </div>
                            ) : (
                                getFilteredCandidates().slice(0, 10).map((candidate, index) => (
                                    <motion.div
                                        key={candidate.id}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-background rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/home/popular-councillors/${candidate.id}`)}
                                    >
                                        {/* Candidate Container */}
                                        <div className="flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                        {candidate.profile_picture ? (
                                                            <Image
                                                                src={candidate.profile_picture}
                                                                alt={candidate.candidate_name}
                                                                width={40}
                                                                height={40}
                                                                className="object-cover"
                                                                onError={(e) => {
                                                                    // Fallback to initials if image fails to load
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-lg">
                                                                {candidate.candidate_name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-base font-semibold text-primary truncate max-w-[15ch]">
                                                        {candidate.candidate_name}
                                                    </span>
                                                </div>
                                                {/* Votes Display */}
                                                <div className="text-sm font-semibold text-blue-600">
                                                    {candidate.votes} votes
                                                </div>
                                            </div>
                                            {/* Candidate Bio & Department */}
                                            <div className="flex flex-col mt-1">
                                                <span className="text-sm text-muted-foreground truncate max-w-[20ch]">
                                                    {candidate.manifesto ? candidate.manifesto.slice(0, 30) + (candidate.manifesto.length > 30 ? '...' : '') : 'No manifesto available'}
                                                </span>
                                                {candidate.department && (
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {candidate.department}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                {/* Middle Section - 50% */}
                <section className="w-full xl:w-[50%] xl:ml-[20%] border-r bg-muted p-4 sm:p-6 md:p-8 xl:p-10">

                    {/* 'What's On Your Mind?' Container */}
                    <Link href="/home/add">
                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-background rounded-lg p-4 shadow-sm mb-6 border cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    {currentUser.profilePicture ? (
                                        <Image
                                            src={currentUser.profilePicture}
                                            alt="Your profile"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    ) : currentUser.fullName ? (
                                        <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-lg">
                                            {currentUser.fullName.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-lg">
                                            {currentUser.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600">
                                    {"What's Happening On Campus?"}
                                </p>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Posts Container - Now the scrollable element */}
                    <div
                        ref={postsContainerRef}
                        className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >

                        {/* Pull-to-refresh loading spinner */}
                        {isLoadingNewerPosts && (
                            <div className="flex justify-center py-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    <span className="text-sm">Loading new posts...</span>
                                </div>
                            </div>
                        )}


                        {/* Loading State for Posts */}
                        {displayIsLoadingPosts && (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="bg-background rounded-xl border shadow-sm animate-pulse">
                                        <div className="p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                                <div className="space-y-1">
                                                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                                                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            </div>
                                            <div className="h-48 bg-gray-300 rounded mt-3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error State for Posts */}
                        {isPostsError && displayPostsError && (
                            <div className="text-center py-8">
                                <p className="text-red-500 text-sm mb-2">
                                    {typeof displayPostsError === 'object' && displayPostsError.message
                                        ? displayPostsError.message
                                        : typeof displayPostsError === 'string'
                                        ? displayPostsError
                                        : 'Failed to load posts. Please try again later.'
                                    }
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {/* Real Posts Display */}
                        {!displayIsLoadingPosts && !isPostsError && displayPosts.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground text-sm">No posts found</p>
                            </div>
                        )}

                        {!displayIsLoadingPosts && !isPostsError && (() => {
                            // Filter posts based on active category
                            const filteredPosts = displayPosts.filter(post => {
                                if (activeCategory === 'All') {
                                    return true; // Show all posts
                                }

                                // Check if post has parties and if any party matches the active category
                                if (post.parties && post.parties.length > 0) {
                                    return post.parties.some((party) =>
                                        party.party_name === activeCategory
                                    );
                                }

                                return false; // If no parties, don't show in filtered categories
                            });

                            return filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-background rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                    onClick={() => router.push(`/post/${post.id}`)}
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between p-4 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                {post.is_anonymous ? (
                                                    <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-lg">
                                                        ?
                                                    </div>
                                                ) : post.profile_picture ? (
                                                    <Image
                                                        src={getUserProfilePicture(post.user)}
                                                        alt={getUserDisplayName(post.user)}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            // Fallback to initials if image fails to load
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
                                                <div className="flex items-center gap-1">
                                                    {!post.is_anonymous && post.user?.id ? (
                                                        <Link
                                                            href={`/home/userprofile/${post.user.id}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-sm font-semibold text-primary hover:underline"
                                                        >
                                                            {getUserDisplayName(post.user)}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-sm font-semibold text-primary">
                                                            {post.is_anonymous ? 'Anonymous' : getUserDisplayName(post.user)}
                                                        </span>
                                                    )}
                                                    {!post.is_anonymous && (
                                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {post.is_anonymous ? 'Anonymous User' : `@${post.username}`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" onClick={(e) => e.stopPropagation()}>
                                                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem
                                                        onClick={(e) => { e.stopPropagation(); sharePost(post.id); }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Share className="w-4 h-4 mr-2" />
                                                        Share Post
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="px-4 pb-3">
                                        <p className="text-sm text-primary leading-relaxed mb-3">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Post Media Carousel - Combine images and videos */}
                                    {((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (
                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                                            {(() => {
                                                // Extract base64 data from media objects and categorize by type
                                                const extractAndCategorizeMedia = (
                                                    mediaArray: PostMediaItem[] | null | undefined
                                                ) => {
                                                    if (!mediaArray || !Array.isArray(mediaArray)) return { images: [], videos: [] };

                                                    const images: string[] = [];
                                                    const videos: string[] = [];

                                                    mediaArray.forEach((item) => {
                                                        const dataUrl =
                                                            typeof item === 'string'
                                                                ? item
                                                                : item && typeof item === 'object'
                                                                  ? item.data
                                                                  : undefined;
                                                        if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
                                                            return;
                                                        }
                                                        const mimeType = dataUrl.split(';')[0].split(':')[1];

                                                        if (mimeType.startsWith('image/')) {
                                                            images.push(dataUrl);
                                                        } else if (mimeType.startsWith('video/')) {
                                                            videos.push(dataUrl);
                                                        }
                                                    });

                                                    return { images, videos };
                                                };

                                                const { images: imageUrls, videos: videoUrls } = extractAndCategorizeMedia(post.images);
                                                const { images: videoImageUrls, videos: videoVideoUrls } = extractAndCategorizeMedia(post.videos);

                                                // Combine all images and videos
                                                const allImages = [...imageUrls, ...videoImageUrls];
                                                const allVideos = [...videoUrls, ...videoVideoUrls];

                                                const combinedMedia = [
                                                    ...allImages,
                                                    ...allVideos
                                                ];

                                                console.log('📸 Post media data:', {
                                                    postId: post.id,
                                                    originalImages: post.images?.length || 0,
                                                    originalVideos: post.videos?.length || 0,
                                                    extractedImages: allImages.length,
                                                    extractedVideos: allVideos.length,
                                                    combinedMedia: combinedMedia.length
                                                });

                                                // Debug the actual structure of media objects
                                                if (post.images && post.images.length > 0) {
                                                    console.log('🔍 Images structure:', {
                                                        firstImage: post.images[0],
                                                        firstImageKeys: post.images[0] ? Object.keys(post.images[0]) : [],
                                                        firstImageType: typeof post.images[0],
                                                        extractedUrl: imageUrls[0],
                                                        mimeType: imageUrls[0] ? imageUrls[0].split(';')[0].split(':')[1] : 'none'
                                                    });
                                                }

                                                if (post.videos && post.videos.length > 0) {
                                                    console.log('🎥 Videos structure:', {
                                                        firstVideo: post.videos[0],
                                                        firstVideoKeys: post.videos[0] ? Object.keys(post.videos[0]) : [],
                                                        firstVideoType: typeof post.videos[0],
                                                        extractedUrl: videoUrls[0],
                                                        mimeType: videoUrls[0] ? videoUrls[0].split(';')[0].split(':')[1] : 'none'
                                                    });
                                                }

                                                // Debug display - show what we're working with
                                                return (
                                                    <div>

                                                        {/* Only show carousel if we have valid media */}
                                                        {combinedMedia.length > 0 ? (
                                                            <InstagramCarousel
                                                                images={combinedMedia}
                                                                alt={`Post by ${post.is_anonymous ? 'Anonymous' : getUserDisplayName(post.user)}`}
                                                            />
                                                        ) : (
                                                            <div className="bg-gray-100 p-4 text-center text-gray-500 rounded">
                                                                No valid media found
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}



                                    {/* Interaction Buttons */}
                                    <div className="px-4 py-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        className={`flex items-center gap-1 transition-all duration-200 p-1 rounded ${votingState[post.id] === 'upvoted'
                                                                ? 'text-green-600 bg-green-100'
                                                                : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                                                            } ${votingLoading[post.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        onClick={() => !votingLoading[post.id] && handleUpvote(post.id)}
                                                        title="Upvote"
                                                        disabled={votingLoading[post.id]}
                                                    >
                                                        <ArrowBigUp className={`w-4 h-4 ${votingLoading[post.id] ? 'animate-pulse' : ''}`} />
                                                    </button>
                                                    <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">{post.upvotes || 0}</span>
                                                    <button
                                                        className={`flex items-center gap-1 transition-all duration-200 p-1 rounded ${votingState[post.id] === 'downvoted'
                                                                ? 'text-red-600 bg-red-100'
                                                                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                                            } ${votingLoading[post.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        onClick={() => !votingLoading[post.id] && handleDownvote(post.id)}
                                                        title="Downvote"
                                                        disabled={votingLoading[post.id]}
                                                    >
                                                        <ArrowBigDown className={`w-4 h-4 ${votingLoading[post.id] ? 'animate-pulse' : ''}`} />
                                                    </button>
                                                    <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">{post.downvotes || 0}</span>
                                                </div>
                                                <button
                                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 p-1 rounded"
                                                    onClick={() => handleComment(post)}
                                                    title="Comment"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                    <span className="text-sm font-medium text-gray-700">{post.comments?.length || 0}</span>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </motion.article>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground text-sm">No posts found for {activeCategory}</p>
                                </div>
                            );
                        })()}

                        {/* Load More Button */}
                        {!displayIsLoadingPosts && !isPostsError && hasNextPage && (
                            <div className="flex justify-center py-6">
                                <Button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    variant="outline"
                                    className="px-6"
                                >
                                    {isFetchingNextPage ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Posts'
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* End of posts indicator */}
                        {!displayIsLoadingPosts && !isPostsError && !hasNextPage && displayPosts.length > 0 && (
                            <div className="text-center py-6">
                                <p className="text-muted-foreground text-sm">{"You've reached the end of the posts"}</p>
                            </div>
                        )}

                        {/* Infinite scroll trigger - invisible element at bottom */}
                        <div ref={loadMoreTriggerRef} className="h-10" />
                    </div>
                </section>


                {/* Right Section - 30% */}
                <section className="hidden xl:block w-[28%] bg-muted p-4 fixed right-4 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* Top Parties Heading */}
                    <h2 className="text-lg font-semibold mb-4">Top Parties</h2>

                    {/* SRC Filter Tabs for Parties */}
                    <Tabs value={selectedPartyTab} onValueChange={setSelectedPartyTab} className="mb-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                            <TabsTrigger value="alice" className="text-xs">Alice</TabsTrigger>
                            <TabsTrigger value="east-london" className="text-xs">East London</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="space-y-3">
                        {isLoadingParties ? (
                            // Loading state for parties
                            <div className="space-y-3">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="bg-background rounded-lg p-3 shadow-sm animate-pulse">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : partiesError ? (
                            // Error state for parties
                            <div className="text-center text-muted-foreground py-4">
                                <p className="text-sm">{partiesError}</p>
                            </div>
                        ) : getFilteredParties().length === 0 ? (
                            // Empty state for parties
                            <div className="text-center text-muted-foreground py-4">
                                <p className="text-sm">
                                    {selectedPartyTab === "all" ? "No parties found" :
                                     selectedPartyTab === "alice" ? "No Alice SRC parties found" :
                                     "No East London SRC parties found"}
                                </p>
                            </div>
                        ) : (
                            // Parties mapping
                            getFilteredParties().slice(0, 10).map((party, index) => (
                                <motion.div
                                    key={party.id}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-background rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => router.push(`/home/parties/${party.id}`)}
                                >
                                    {/* Party Container */}
                                    <div className="flex flex-col h-full">
                                        {/* Party Title & Leader */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                                    {party.logo ? (
                                                        <Image
                                                            src={party.logo}
                                                            alt={party.party_name}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-blue-500 text-xs font-bold">
                                                            {party.party_name.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-primary font-semibold truncate max-w-[20ch] text-sm">
                                                        {party.party_name}
                                                    </span>
                                                    <div>
                                                        <span className="text-sm text-muted-foreground truncate max-w-[25ch] line-clamp-1">
                                                            {party.party_leader || 'Leadership TBA'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>






            {/* Create Content Modal */}
            <CreateContentDialog
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
            />

            {/* Search Query Modal */}
            <SearchQueryDialog
                searchQueryModal={searchQueryModal}
                setSearchQueryModal={setSearchQueryModal}
                activeSearchCategory={activeSearchCategory}
                setActiveSearchCategory={setActiveSearchCategory}
                searchCategories={searchCategories}
            />

            {/* Notifications Modal */}
            <NotificationsDialog
                notificationsModal={notificationsModal}
                setNotificationsModal={setNotificationsModal}
                activeNotificationCategory={activeNotificationCategory}
                setActiveNotificationCategory={setActiveNotificationCategory}
                notificationCategories={notificationCategories}
            />

            {/* User Sidebar */}
            <UserSidebar
                isOpen={isUserSidebarOpen}
                onClose={() => setIsUserSidebarOpen(false)}
            />

            {/* Comment Drawer */}
            <Drawer open={commentDrawerOpen} onOpenChange={(open) => {
                setCommentDrawerOpen(open);
                if (!open) {
                    setCommentText('');
                    setSelectedPostForComment(null);
                }
            }}>
                <DrawerContent className="h-[100vh] max-h-[100vh]">
                    <div className="mx-auto w-full max-w-2xl h-full flex flex-col">
                        <DrawerHeader>
                            <DrawerTitle>Comments</DrawerTitle>
                            <DrawerDescription>
                                {selectedPostForComment ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                            {selectedPostForComment.is_anonymous ? (
                                                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                                                    ?
                                                </div>
                                            ) : selectedPostForComment.profile_picture ? (
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
                                                {selectedPostForComment.is_anonymous ? 'Anonymous' : getUserDisplayName(selectedPostForComment.user)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {selectedPostForComment.content.length > 50
                                                    ? selectedPostForComment.content.substring(0, 50) + '...'
                                                    : selectedPostForComment.content
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    'View and add comments to this post'
                                )}
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="p-4 pb-0 flex-1 flex flex-col min-h-0">
                            {/* Comments List */}
                            <div ref={commentsListRef} className="space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0 pr-2 scroll-smooth">
                                {selectedPostForComment?.comments && selectedPostForComment.comments.length > 0 ? (
                                    selectedPostForComment.comments.map((comment: PostComment, index: number) => (
                                        <div key={comment.id || index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                                {comment.profile_picture ? (
                                                    <Image
                                                        src={comment.profile_picture.startsWith('data:')
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
                                                        {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.text}</p>
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

                            {/* Add Comment Form */}
                            <div className="mt-6 p-4 bg-background rounded-lg flex-shrink-0">
                                <div className="flex gap-3 background">
                                    <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-blue-500 font-semibold text-sm">
                                        {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="w-full p-3 border border-gray-200 rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        </div>

                        <DrawerFooter className="flex-shrink-0">
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Toast Notifications */}
            <Toaster />
        </div>
    );
}
