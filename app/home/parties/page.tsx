'use client';

import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, Info, Plus, Pen, Mic, Book, Compass, MoreHorizontal, Heart, MessageCircle, Repeat2, Bookmark, ArrowBigDown, ArrowBigUp, Share } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog5, DialogContent5, DialogHeader5, DialogTitle5 } from "@/components/InboxPage/dialog5";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, Mail, UserCircleIcon, Search, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import useWindowSize from '@/hooks/useWindow';
import { UserSidebar } from '@/components/HomePage/userSidebar';
import WriterDetailsSheet, {
    type InboxWriterSummary,
} from "@/components/InboxPage/WriterDetailsSheet";
import PublicationDetailsSheet, {
    type InboxPublicationSummary,
} from "@/components/InboxPage/PublicationDetailsSheet";
import CreateContentDialog from "@/components/InboxPage/CreateContentDialog"
import { SearchQueryDialog } from "@/components/HomePage/searchQueryDialog"
import { NotificationsDialog } from "@/components/InboxPage/notificationsDialog"
import { useAppSelector } from "@/redux/hooks";
import { InstagramCarousel } from '@/components/ui/instagram-carousel';
import * as React from "react";
import { toast, Toaster } from 'sonner';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useInfiniteQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/api-config';

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

// Interface for Candidates API response
interface GetCandidatesResponse {
    message: string;
    candidates: Candidate[];
    count: number;
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
    'Environment',
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
    "All",
]


const topWriters = [
    {
        name: "Sarah Johnson",
        publication: "African National Congress",
        followers: "12.5K",
        description:
            "Award-winning technology journalist with over 10 years of experience covering AI, cybersecurity, and digital transformation. Sarah has been recognized for her in-depth analysis and ability to explain complex tech concepts to a broad audience.",
        image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    },
    {
        name: "Michael Chen",
        publication: "Economic Freedom Fighters",
        followers: "8.2K",
        description:
            "Business strategist and financial analyst specializing in market trends and corporate innovation. Michael provides expert insights on global markets, startup ecosystems, and emerging business models.",
        image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    },
    {
        name: "Dr. Emily Rodriguez",
        publication: "Democratic Alliance",
        followers: "15.3K",
        description:
            "PhD in Astrophysics with a passion for making complex scientific concepts accessible. Dr. Rodriguez has published numerous papers on space exploration and quantum mechanics.",
        image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    },
    {
        name: "Dr. James Wilson",
        publication: "Inkatha Freedom Party",
        followers: "9.8K",
        description:
            "Board-certified physician and health policy expert. Dr. Wilson combines clinical experience with public health expertise to provide comprehensive health coverage.",
        image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
    {
        name: "Lisa Martinez",
        publication: "National Party",
        followers: "7.6K",
        description:
            "Cultural critic and art historian exploring the intersection of traditional and contemporary art. Lisa brings a fresh perspective to cultural commentary and artistic expression.",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    },
    {
        name: "David Thompson",
        publication: "African Christian Democratic Party",
        followers: "11.2K",
        description:
            "International correspondent with experience covering major global events. David provides nuanced analysis of international relations and global affairs.",
        image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    },
    {
        name: "Rachel Kim",
        publication: "United Democratic Movement",
        followers: "6.9K",
        description:
            "Innovation strategist and tech entrepreneur. Rachel focuses on emerging technologies, startup culture, and the future of work.",
        image:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    },
    {
        name: "Marcus Brown",
        publication: "Black First Land First",
        followers: "10.4K",
        description:
            "Financial analyst and investment strategist with expertise in personal finance and market analysis. Marcus helps readers make informed financial decisions.",
        image:
            "https://images.unsplash.com/photo-1519085360759-af311aac14e7?w=200&h=200&fit=crop",
    },
    {
        name: "Sophie Anderson",
        publication: "Environment Now",
        followers: "5.7K",
        description:
            "Environmental scientist and climate policy expert. Sophie covers environmental issues, sustainability, and climate change with a focus on solutions.",
        image:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
    },
    {
        name: "Alex Rivera",
        publication: "Career Guide",
        followers: "4.8K",
        description:
            "Career development expert and professional coach. Alex provides practical advice on career growth, professional development, and workplace dynamics.",
        image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    },
];

const topPublications = [
    {
        name: "African National Congress (ANC)",
        author: "Cyril Ramaphosa",
        Supporters: "Millions",
        Subscribers: "Millions",
        icon: "https://upload.wikimedia.org/wikipedia/commons/6/6d/ANC_logo.png",
        category: "Political Party",
        description:
            "The ANC is South Africa's ruling party since 1994, known for its role in the anti-apartheid movement and leading the country to democracy.",
    },
    {
        name: "Democratic Alliance (DA)",
        author: "John Steenhuisen",
        Supporters: "Millions",
        Subscribers: "Millions",
        icon: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Democratic_Alliance_logo.svg",
        category: "Political Party",
        description:
            "The DA is the official opposition party, advocating for liberal democracy, non-racialism, and a market-driven economy.",
    },
    {
        name: "Economic Freedom Fighters (EFF)",
        author: "Julius Malema",
        Supporters: "Millions",
        Subscribers: "Millions",
        icon: "https://upload.wikimedia.org/wikipedia/commons/2/2f/EFF_Logo.png",
        category: "Political Party",
        description:
            "The EFF is a leftist, pan-Africanist party known for its radical stance on land reform and economic justice.",
    },
    {
        name: "Inkatha Freedom Party (IFP)",
        author: "Velenkosini Hlabisa",
        Supporters: "Hundreds of thousands",
        Subscribers: "Hundreds of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Inkatha_Freedom_Party_logo.png",
        category: "Political Party",
        description:
            "The IFP is a traditionalist party with a strong base in KwaZulu-Natal, focusing on federalism and Zulu cultural values.",
    },
    {
        name: "Freedom Front Plus (FF+)",
        author: "Pieter Groenewald",
        Supporters: "Hundreds of thousands",
        Subscribers: "Hundreds of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Freedom_Front_Plus_logo.png",
        category: "Political Party",
        description:
            "FF+ is a minority rights party, primarily representing Afrikaner interests and advocating for self-determination.",
    },
    {
        name: "United Democratic Movement (UDM)",
        author: "Bantu Holomisa",
        Supporters: "Tens of thousands",
        Subscribers: "Tens of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/7/7d/United_Democratic_Movement_logo.png",
        category: "Political Party",
        description:
            "The UDM is a centrist party founded in 1997, focusing on anti-corruption and good governance.",
    },
    {
        name: "African Christian Democratic Party (ACDP)",
        author: "Kenneth Meshoe",
        Supporters: "Tens of thousands",
        Subscribers: "Tens of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/2/2d/African_Christian_Democratic_Party_logo.png",
        category: "Political Party",
        description:
            "The ACDP is a Christian democratic party promoting family values, religious freedom, and social conservatism.",
    },
    {
        name: "ActionSA",
        author: "Herman Mashaba",
        Supporters: "Hundreds of thousands",
        Subscribers: "Hundreds of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/2/2a/ActionSA_logo.png",
        category: "Political Party",
        description:
            "ActionSA is a relatively new party focused on anti-corruption, economic growth, and effective governance.",
    },
    {
        name: "Al Jama-ah",
        author: "Ganief Hendricks",
        Supporters: "Tens of thousands",
        Subscribers: "Tens of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Al_Jama-ah_logo.png",
        category: "Political Party",
        description:
            "Al Jama-ah is a party representing Muslim interests, advocating for social justice and moral governance.",
    },
    {
        name: "Patriotic Alliance (PA)",
        author: "Gayton McKenzie",
        Supporters: "Tens of thousands",
        Subscribers: "Tens of thousands",
        icon: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Patriotic_Alliance_logo.png",
        category: "Political Party",
        description:
            "The PA is a growing party focused on community upliftment, anti-crime, and economic opportunity for all South Africans.",
    },
];

const articles = [
    {
        publisher: {
            name: "Tech Daily",
            icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop",
        },
        title:
            "The Future of Artificial Intelligence in Healthcare And Its Dangerous Side Effects",
        subtitle:
            "How AI is revolutionizing medical diagnosis and treatment and its dangerous side effects. This article will explore the potential benefits and risks of AI in healthcare. Every day, we are witnessing the rapid advancement of artificial intelligence (AI) in various industries, including healthcare. While AI has the potential to transform the way we diagnose and treat diseases, it also poses significant risks that could impact patient safety and outcomes.",
        readTime: "5 min read",
        author: "Sarah Johnson",
        images: [
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop"
        ],
        category: "Technology",
        date: "March 15, 2024",
    },
    {
        publisher: {
            name: "Business Insights",
            icon: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&h=100&fit=crop",
        },
        title: "Sustainable Business Practices in 2024",
        subtitle: "Companies leading the way in environmental responsibility",
        readTime: "4 min read",
        author: "Michael Chen",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=400&fit=crop"
        ],
        category: "Business",
        date: "March 14, 2024",
    },
    {
        publisher: {
            name: "Science Weekly",
            icon: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop",
        },
        title: "Breakthrough in Quantum Computing",
        subtitle: "New research shows promising results in quantum supremacy",
        readTime: "6 min read",
        author: "Dr. Emily Rodriguez",
        images: [
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
        ],
        category: "Science",
        date: "March 13, 2024",
    },
    {
        publisher: {
            name: "Health Today",
            icon: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop",
        },
        title: "The Impact of Sleep on Mental Health",
        subtitle:
            "New studies reveal the connection between sleep patterns and mental well-being",
        readTime: "3 min read",
        author: "Dr. James Wilson",
        images: [
            "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=400&fit=crop"
        ],
        category: "Health",
        date: "March 12, 2024",
    },
    {
        publisher: {
            name: "Arts & Culture",
            icon: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=100&h=100&fit=crop",
        },
        title: "The Renaissance of Digital Art",
        subtitle: "How technology is transforming the art world",
        readTime: "4 min read",
        author: "Lisa Martinez",
        images: [
            "https://images.unsplash.com/photo-1515405295579-ba7e45403062?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
        ],
        category: "Arts",
        date: "March 11, 2024",
    },
];

// Interface for User data from backend
interface User {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    candidate: boolean;
    votes: number;
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

// Interface for API response
interface GetUsersResponse {
    message: string;
    users: User[];
}

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

// Interface for Post data from backend
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

// Function to fetch all parties from backend
const fetchAllParties = async (): Promise<Party[]> => {
    try {
        console.log('🔄 Fetching parties from:', `${API_BASE_URL}/somaapp/get-all-parties/`);

        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-parties/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication if needed
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ HTTP Error:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data: GetPartiesResponse = await response.json();
        console.log('✅ Raw parties response:', data);

        if (!data.parties || !Array.isArray(data.parties)) {
            console.error('❌ Invalid parties data structure:', data);
            throw new Error('Invalid response structure: parties not found or not an array');
        }

        console.log('✅ Parties fetched successfully:', data.parties.length, 'parties');
        return data.parties;
    } catch (error) {
        console.error('❌ Error fetching parties:', error);
        throw error;
    }
};

// Function to fetch all candidates from backend
const fetchAllCandidates = async (): Promise<Candidate[]> => {
    try {
        console.log('🔄 Fetching candidates from:', `${API_BASE_URL}/somaapp/get-all-candidates/`);

        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-candidates/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for authentication if needed
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Response error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data: GetCandidatesResponse = await response.json();
        console.log('✅ Candidates fetched successfully:', data);
        console.log('👥 Number of candidates:', data.candidates.length);

        return data.candidates;
    } catch (error) {
        console.error('❌ Error fetching candidates:', error);
        throw error;
    }
};

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

// Inbox Page
export default function InboxPage() {
    // activeCategory
    const [activeCategory, setActiveCategory] = useState('All');
    // scrollContainerRef
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    // partiesScrollRef
    const partiesScrollRef = useRef<HTMLDivElement>(null);
    // postsContainerRef
    const postsContainerRef = useRef<HTMLDivElement>(null);
    // mounted
    const [mounted, setMounted] = useState(false);
    // selectedWriter
    const [selectedWriter, setSelectedWriter] =
        useState<InboxWriterSummary | null>(null);
    // selectedPublication
    const [selectedPublication, setSelectedPublication] =
        useState<InboxPublicationSummary | null>(null);
    // setTheme
    const { setTheme } = useTheme();
    // Add new state for create modal
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Search Query useState()
    const [searchQueryModal, setSearchQueryModal] = useState(false);

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // parties state for fetched parties from database
    const [parties, setParties] = useState<Party[]>([]);
    const [isLoadingParties, setIsLoadingParties] = useState(true);
    const [partiesError, setPartiesError] = useState<string | null>(null);

    // users state for fetched users from database (candidates only)
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [usersError, setUsersError] = useState<string | null>(null);

    // candidates state for fetched candidates from database
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
    const [candidatesError, setCandidatesError] = useState<string | null>(null);

    // Tab state for filtering candidates
    const [selectedTab, setSelectedTab] = useState<string>("all");

    // Tab state for filtering parties
    const [selectedPartyTab, setSelectedPartyTab] = useState<string>("all");

    // posts state for fetched posts from database
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);

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

    // activeSearchCategory useState()
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    // activeNotificationCategory useState()
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    // Router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();

    // useWindowSize
    const { width } = useWindowSize();

    const currentUser = useAppSelector((state) => state.user);

    // Generate categories including party names
    const currentUserCategories = React.useMemo(() => {
        const baseCategories = ['All'];
        const partyCategories = parties.map(party => party.party_name);
        return [...baseCategories, ...partyCategories];
    }, [parties]);

    // Filter posts based on active category
    const filteredPosts = React.useMemo(() => {
        if (!posts.length) return [];

        if (activeCategory === 'All') {
            return posts;
        }

        // Filter posts by selected party
        return posts.filter(post => {
            // Check if post has parties and if any of them match the active category
            if (post.parties && post.parties.length > 0) {
                return post.parties.some(party => party.party_name === activeCategory);
            }
            return false;
        });
    }, [posts, activeCategory]);

    // Theme support
    const { theme } = useTheme();

    // Helper functions for user data
    const getUserDisplayName = (user: User) => {
        return user.full_name || user.username || 'Unknown User';
    };

    const getUserProfilePicture = (user: User) => {
        return user.profile_picture || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";
    };

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

    // Function to fetch all posts from backend
    const fetchAllPosts = async (): Promise<Post[]> => {
        try {
            console.log('🔄 Fetching posts from:', `${API_BASE_URL}/somaapp/get-all-posts/`);

            const response = await fetch(`${API_BASE_URL}/somaapp/get-all-posts/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication if needed
            });

            console.log('📡 Posts response status:', response.status);
            console.log('📡 Posts response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Posts response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data: GetPostsResponse = await response.json();
            console.log('✅ Posts fetched successfully:', data);
            console.log('📝 Number of posts:', data.posts.length);

            // Debug: Log the first post's structure to see what we're working with
            if (data.posts.length > 0) {
                const firstPost = data.posts[0];
                console.log('🔍 First post structure:', {
                    id: firstPost.id,
                    content: firstPost.content,
                    images: firstPost.images,
                    videos: firstPost.videos,
                    imagesType: typeof firstPost.images,
                    videosType: typeof firstPost.videos,
                    imagesLength: firstPost.images ? firstPost.images.length : 'undefined',
                    videosLength: firstPost.videos ? firstPost.videos.length : 'undefined'
                });

                // Check if images/videos are actually arrays
                if (firstPost.images) {
                    console.log('📸 Images array check:', {
                        isArray: Array.isArray(firstPost.images),
                        firstImage: firstPost.images[0],
                        firstImageType: typeof firstPost.images[0]
                    });
                }

                if (firstPost.videos) {
                    console.log('🎥 Videos array check:', {
                        isArray: Array.isArray(firstPost.videos),
                        firstVideo: firstPost.videos[0],
                        firstVideoType: typeof firstPost.videos[0]
                    });
                }
            }

            return data.posts;
        } catch (error) {
            console.error('❌ Error fetching posts:', error);
            throw error;
        }
    };

    // Function to fetch all users from backend and sort by votes (highest first)
    const fetchUsersVotingLeaderboard = async (): Promise<User[]> => {
        try {
            console.log('🔄 Fetching users from:', `${API_BASE_URL}/somaapp/get-all-users/`);

            const response = await fetch(`${API_BASE_URL}/somaapp/get-all-users/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication if needed
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data: GetUsersResponse = await response.json();
            console.log('✅ Users fetched successfully:', data);
            console.log('👥 Number of users:', data.users.length);

            // Sort users by votes in descending order (highest votes first)
            const sortedUsers = data.users.sort((a, b) => b.votes - a.votes);
            console.log('🏆 Users sorted by votes:', sortedUsers.map(user => ({ username: user.username, votes: user.votes })));

            return sortedUsers;
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            throw error;
        }
    };

    // useEffect
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch parties from the database
    useEffect(() => {
        const loadParties = async () => {
            try {
                console.log('🚀 Starting to load parties...');
                setIsLoadingParties(true);
                setPartiesError(null);
                const fetchedParties = await fetchAllParties();
                console.log('✅ Parties loaded successfully:', fetchedParties);
                setParties(fetchedParties);
            } catch (error) {
                console.error('❌ Error loading parties:', error);
                setPartiesError('Failed to load parties. Please try again later.');
            } finally {
                setIsLoadingParties(false);
                console.log('🔄 Parties loading complete');
            }
        };

        loadParties();
    }, []);

    // Fetch users from the database (candidates only, sorted by votes)
    useEffect(() => {
        const loadUsers = async () => {
            try {
                console.log('🚀 Starting to load users voting leaderboard...');
                setIsLoadingUsers(true);
                setUsersError(null);
                const fetchedUsers = await fetchUsersVotingLeaderboard();
                console.log('✅ Users loaded successfully:', fetchedUsers);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('❌ Error loading users:', error);
                setUsersError('Failed to load candidates. Please try again later.');
            } finally {
                setIsLoadingUsers(false);
                console.log('🔄 Users loading complete');
            }
        };

        loadUsers();
    }, []);

    // Fetch candidates from the database
    useEffect(() => {
        const loadCandidates = async () => {
            try {
                console.log('🚀 Starting to load candidates...');
                setIsLoadingCandidates(true);
                setCandidatesError(null);
                const fetchedCandidates = await fetchAllCandidates();
                console.log('✅ Candidates loaded successfully:', fetchedCandidates);
                setCandidates(fetchedCandidates);
            } catch (error) {
                console.error('❌ Error loading candidates:', error);
                setCandidatesError('Failed to load candidates. Please try again later.');
            } finally {
                setIsLoadingCandidates(false);
                console.log('🔄 Loading complete');
            }
        };

        loadCandidates();
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
        getNextPageParam: (lastPage: { posts: Post[]; nextPage: number | null; hasNextPage: boolean }) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
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

    // scroll
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // horizontal scroll for Parties tab
    const scrollParties = (direction: 'left' | 'right') => {
        if (partiesScrollRef.current) {
            const scrollAmount = 240;
            const newScrollLeft = partiesScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            partiesScrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Infinite scroll using Intersection Observer
    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    console.log('🔄 Auto-loading next page...');
                    fetchNextPage();
                }
            },
            {
                rootMargin: '100px', // Trigger 100px before the element is visible
                threshold: 0.1
            }
        );

        const loadMoreTrigger = document.querySelector('.h-10');
        if (loadMoreTrigger) {
            observer.observe(loadMoreTrigger);
        }

        return () => {
            if (loadMoreTrigger) {
                observer.unobserve(loadMoreTrigger);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Initialize last scroll position
    useEffect(() => {
        if (postsContainerRef.current) {
            setLastScrollTop(postsContainerRef.current.scrollTop);
        }
    }, []);

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

    // TEMP: Subscribed parties placeholder until wired to real user data
    const subscribedParties = topPublications;

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

    return (
        <div className="flex flex-col min-h-screen bg-muted font-comfortaa">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    {/* Left - SOMA (Company Logo) */}
                    { typeof window !== 'undefined' && window.innerWidth > 639 ?
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
                        :
                        <UserCircleIcon
                            className="h-6 w-6 text-primary cursor-pointer"
                            onClick={() => setIsUserSidebarOpen(true)}
                        />
                    }

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
                    <div className="absolute bg-background left-0 top-0 h-full w-10 md:w-20 z-10 hover:from-background hover:via-background flex items-center justify-around gap-2 cursor-pointer">
                        <button
                            onClick={() => scroll("left")}
                            className="flex items-center justify-center cursor-pointer hidden md:block"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-primary" />
                        </button>
                    </div>

                    {/* Categories Container */}
                    <div
                        ref={scrollContainerRef}
                        className="md:ml-10 flex items-center justify-start space-x-2 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-12"
                    >
                        {currentUserCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category
                                    ? 'text-primary-foreground bg-primary px-4 py-2 rounded-sm'
                                    : 'text-primary bg-muted hover:text-primary hover:bg-muted px-4 py-2 rounded-sm'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:block absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-background via-background to-transparent hover:from-background hover:via-background flex items-center justify-center"
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

                    {/* Posts Container */}
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
                                                {!post.is_anonymous && post.user?.candidate && (
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
                                {((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (() => {
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

                                    return (
                                        <div className="relative" onClick={(e) => e.stopPropagation()}>
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

                                {/* Interaction Buttons */}
                                <div className="px-4 py-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1">
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
                                        <button className="text-gray-600 hover:text-blue-500 transition-colors">
                                            <Bookmark className="w-5 h-5" />
                                        </button>
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
                        <div className="h-10" />
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


            {/* Writer Details Sheet */}
            <WriterDetailsSheet
                selectedWriter={selectedWriter}
                setSelectedWriter={setSelectedWriter}
                articles={articles}
            />

            {/* Publication Details Sheet */}
            <PublicationDetailsSheet
                selectedPublication={selectedPublication}
                setSelectedPublication={setSelectedPublication}
                articles={articles}
            />

            {/* 'What's On Your Mind?' Input Field Pop-Up Modal */}
            <CreateContentDialog
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
            />

            {/* Search Query Modal */}
            <SearchQueryDialog
                searchQueryModal={searchQueryModal}
                setSearchQueryModal={setSearchQueryModal}
                searchCategories={searchCategories}
                activeSearchCategory={activeSearchCategory}
                setActiveSearchCategory={setActiveSearchCategory}
            />

            {/* Notifications Modal */}
            <NotificationsDialog
                notificationsModal={notificationsModal}
                setNotificationsModal={setNotificationsModal}
                notificationCategories={notificationCategories}
                activeNotificationCategory={activeNotificationCategory}
                setActiveNotificationCategory={setActiveNotificationCategory}
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
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-sm">
                                        {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="w-full p-3 bg-background border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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