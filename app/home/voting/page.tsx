'use client';

import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Compass, UserCircleIcon, Search, LayoutDashboard } from 'lucide-react';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog6, DialogContent6, DialogHeader6, DialogTitle6, DialogDescription6 } from "@/components/MagazinePage/dialog6";
import { NotificationsDialog } from "@/components/MagazinePage/notificationsDialog";
import { SearchQueryDialog } from "@/components/MagazinePage/searchQueryDialog";

import Image from "next/image";
import React from "react";
import { Dialog2 } from '@/components/HomePage/dialog2';
import { DialogContent2 } from '@/components/HomePage/dialog2';
import { DialogHeader2 } from '@/components/HomePage/dialog2';
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import useWindowSize from '@/hooks/useWindow';
import { UserSidebar } from '@/components/HomePage/userSidebar';
import { motion } from 'motion/react';
import { useAppSelector } from "@/redux/hooks";
import { API_BASE_URL } from '@/lib/api-config';

const searchCategories = [
    "All",
    "Polical Parties",
    "Leaders",
]

const notificationCategories = [
    "All"
]


const DummyContent = () => {
    return (
        <>
            {[...new Array(3).fill(1)].map((_, index) => {
                return (
                    <div
                        key={"dummy-content" + index}
                        className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
                    >
                        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                            <span className="font-bold text-neutral-700 dark:text-neutral-200">
                                The first rule of Apple club is that you boast about Apple club.
                            </span>{" "}
                            Keep a journal, quickly jot down a grocery list, and take amazing
                            class notes. Want to convert those notes to text? No problem.
                            Langotiya jeetu ka mara hua yaar is ready to capture every
                            thought.
                        </p>
                        <Image
                            src="https://assets.aceternity.com/macbook.png"
                            alt="Macbook mockup from Aceternity UI"
                            height="500"
                            width="500"
                            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
                        />
                    </div>
                );
            })}
        </>
    );
};

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
}

// Interface for Post data from backend
interface Post {
    id: number;
    user: User;
    username: string;
    profile_picture: string;
    content: string;
    images: string[];
    videos: string[];
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
}

// Interface for Posts API response
interface GetPostsResponse {
    message: string;
    posts: Post[];
    count: number;
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



export default function MagazinesPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const categoriesScrollRef = useRef<HTMLDivElement>(null);
    const articlesScrollRefAll1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefAll2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSubscribed1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSubscribed2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefPaid1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefPaid2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSaved1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSaved2 = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [mounted, setMounted] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Search Query useState()
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    // Router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();

    // useWindowSize
    const { width } = useWindowSize();

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // showCreateModal useState()
    const [showCreateModal, setShowCreateModal] = useState(false);

    // parties state for fetched parties from database
    const [parties, setParties] = useState<Party[]>([]);
    const [isLoadingParties, setIsLoadingParties] = useState(true);
    const [partiesError, setPartiesError] = useState<string | null>(null);

    const currentUser = useAppSelector((state) => state.user);

    // Active tab states for different sections
    const [activeStructureTab, setActiveStructureTab] = useState<string>('ISRC'); // Main content tabs
    const [leaderboardTab, setLeaderboardTab] = useState<string>('ISRC'); // Leaderboard tabs



    // setTheme useTheme()
    const { setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch parties from the database
    useEffect(() => {
        const loadParties = async () => {
            try {
                console.log('🚀 Starting to load parties for voting...');
                setIsLoadingParties(true);
                setPartiesError(null);
                const fetchedParties = await fetchAllParties();
                console.log('✅ Parties loaded successfully for voting:', fetchedParties);
                setParties(fetchedParties);
            } catch (error) {
                console.error('❌ Error loading parties for voting:', error);
                setPartiesError('Failed to load parties. Please try again later.');
            } finally {
                setIsLoadingParties(false);
                console.log('🔄 Parties loading complete for voting');
            }
        };

        loadParties();
    }, []);

    // Set initial tabs based on user's structure
    useEffect(() => {
        if (currentUser.structure && currentUser.structure !== 'ISRC') {
            setActiveStructureTab(currentUser.structure);
            setLeaderboardTab(currentUser.structure);
        }
    }, [currentUser.structure]);

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
        if (ref.current) {
            setIsScrolling(true);
            setStartX(e.pageX - ref.current.offsetLeft);
            setScrollLeft(ref.current.scrollLeft);
        }
    };

    const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        if (!isScrolling) return;
        if (ref.current) {
            e.preventDefault();
            const x = e.pageX - ref.current.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            ref.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => {
        setIsScrolling(false);
    };

    const handleMouseLeave = () => {
        setIsScrolling(false);
    };


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

    // Theme support
    const { theme } = useTheme();

    // Helper function to get party colors
    const getPartyColors = (partyName: string) => {
        const colorMap: { [key: string]: { bg: string; button: string; accent: string } } = {
            'African National Congress': { bg: 'bg-green-100', button: 'bg-green-600 hover:bg-green-700', accent: 'text-green-600' },
            'ANC': { bg: 'bg-green-100', button: 'bg-green-600 hover:bg-green-700', accent: 'text-green-600' },
            'Democratic Alliance': { bg: 'bg-blue-100', button: 'bg-blue-600 hover:bg-blue-700', accent: 'text-blue-600' },
            'DA': { bg: 'bg-blue-100', button: 'bg-blue-600 hover:bg-blue-700', accent: 'text-blue-600' },
            'Economic Freedom Fighters': { bg: 'bg-red-100', button: 'bg-red-600 hover:bg-red-700', accent: 'text-red-600' },
            'EFF': { bg: 'bg-red-100', button: 'bg-red-600 hover:bg-red-700', accent: 'text-red-600' },
            'Inkatha Freedom Party': { bg: 'bg-green-100', button: 'bg-green-600 hover:bg-green-700', accent: 'text-green-600' },
            'IFP': { bg: 'bg-green-100', button: 'bg-green-600 hover:bg-green-700', accent: 'text-green-600' },
            'Freedom Front Plus': { bg: 'bg-orange-100', button: 'bg-orange-600 hover:bg-orange-700', accent: 'text-orange-600' },
            'FF+': { bg: 'bg-orange-100', button: 'bg-orange-600 hover:bg-orange-700', accent: 'text-orange-600' },
            'United Democratic Movement': { bg: 'bg-purple-100', button: 'bg-purple-600 hover:bg-purple-700', accent: 'text-purple-600' },
            'UDM': { bg: 'bg-purple-100', button: 'bg-purple-600 hover:bg-purple-700', accent: 'text-purple-600' },
            'African Christian Democratic Party': { bg: 'bg-yellow-100', button: 'bg-yellow-600 hover:bg-yellow-700', accent: 'text-yellow-600' },
            'ACDP': { bg: 'bg-yellow-100', button: 'bg-yellow-600 hover:bg-yellow-700', accent: 'text-yellow-600' },
            'ActionSA': { bg: 'bg-teal-100', button: 'bg-teal-600 hover:bg-teal-700', accent: 'text-teal-600' },
            'Al Jama-ah': { bg: 'bg-indigo-100', button: 'bg-indigo-600 hover:bg-indigo-700', accent: 'text-indigo-600' },
            'Patriotic Alliance': { bg: 'bg-pink-100', button: 'bg-pink-600 hover:bg-pink-700', accent: 'text-pink-600' },
            'PA': { bg: 'bg-pink-100', button: 'bg-pink-600 hover:bg-pink-700', accent: 'text-pink-600' },
        };
        
        return colorMap[partyName] || { bg: 'bg-gray-100', button: 'bg-gray-600 hover:bg-gray-700', accent: 'text-gray-600' };
    };

    // Helper function to get short manifesto points
    const getManifestoPoints = (manifesto: string | null) => {
        if (!manifesto) return ['No manifesto available'];
        
        // Try to extract bullet points or create generic ones
        const points = manifesto.split('\n').filter(point => point.trim().length > 0).slice(0, 5);
        if (points.length === 0) {
            return ['View full manifesto for details'];
        }
        return points.map(point => point.startsWith('•') ? point : `• ${point}`);
    };

    // Helper functions for leaderboard calculations
    const getTotalVotes = (filteredParties: Party[]) => {
        return filteredParties.reduce((sum, party) => sum + party.votes, 0);
    };

    const getMainContentTotalVotes = () => {
        return getTotalVotes(getMainContentFilteredParties());
    };

    const getLeaderboardTotalVotes = () => {
        return getTotalVotes(getLeaderboardFilteredParties());
    };

    const getVotePercentage = (partyVotes: number, totalVotes: number) => {
        if (totalVotes === 0) return 0;
        return Math.round((partyVotes / totalVotes) * 100 * 10) / 10; // Round to 1 decimal place
    };

    const getMainContentVotePercentage = (partyVotes: number) => {
        return getVotePercentage(partyVotes, getMainContentTotalVotes());
    };

    const getLeaderboardVotePercentage = (partyVotes: number) => {
        return getVotePercentage(partyVotes, getLeaderboardTotalVotes());
    };

    const getRankColors = (rank: number) => {
        if (rank === 1) return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200', progress: 'bg-yellow-500' };
        if (rank === 2) return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', progress: 'bg-gray-500' };
        if (rank === 3) return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', progress: 'bg-orange-500' };
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', progress: 'bg-gray-400' };
    };

    const getPartyShortName = (partyName: string) => {
        const shortNames: { [key: string]: string } = {
            'African National Congress': 'ANC',
            'Democratic Alliance': 'DA',
            'Economic Freedom Fighters': 'EFF',
            'Inkatha Freedom Party': 'IFP',
            'Freedom Front Plus': 'FF+',
            'United Democratic Movement': 'UDM',
            'African Christian Democratic Party': 'ACDP',
            'Patriotic Alliance': 'PA',
        };
        return shortNames[partyName] || partyName;
    };

    // Filter parties based on active structure tab for main content
    const getMainContentFilteredParties = () => {
        if (activeStructureTab === 'ISRC') {
            return parties.filter(party => party.structure === 'ISRC' || !party.structure);
        } else if (activeStructureTab === currentUser.structure) {
            // Show user's structure parties + ISRC parties
            return parties.filter(party =>
                party.structure === currentUser.structure ||
                party.structure === 'ISRC' ||
                !party.structure
            );
        } else {
            return parties.filter(party =>
                party.structure === activeStructureTab ||
                party.structure === 'ISRC' ||
                !party.structure
            );
        }
    };

    // Filter parties based on leaderboard tab
    const getLeaderboardFilteredParties = () => {
        if (leaderboardTab === 'ISRC') {
            return parties.filter(party => party.structure === 'ISRC' || !party.structure);
        } else if (leaderboardTab === currentUser.structure) {
            // Show user's structure parties + ISRC parties
            return parties.filter(party =>
                party.structure === currentUser.structure ||
                party.structure === 'ISRC' ||
                !party.structure
            );
        } else {
            return parties.filter(party =>
                party.structure === leaderboardTab ||
                party.structure === 'ISRC' ||
                !party.structure
            );
        }
    };

    // Alias for backward compatibility
    const getFilteredParties = getMainContentFilteredParties;

    const DummyContent = () => {
        return (
            <>
                {[...new Array(3).fill(1)].map((_, index) => {
                    return (
                        <div
                            key={"dummy-content" + index}
                            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
                        >
                            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                                <span className="font-bold text-neutral-700 dark:text-neutral-200">
                                    The first rule of Apple club is that you boast about Apple club.
                                </span>{" "}
                                Keep a journal, quickly jot down a grocery list, and take amazing
                                class notes. Want to convert those notes to text? No problem.
                                Langotiya jeetu ka mara hua yaar is ready to capture every
                                thought.
                            </p>
                            <Image
                                src="https://assets.aceternity.com/macbook.png"
                                alt="Macbook mockup from Aceternity UI"
                                height="500"
                                width="500"
                                className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
                            />
                        </div>
                    );
                })}
            </>
        );
    };


    return (
        <div className="flex flex-col min-h-screen bg-background font-comfortaa">


            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    {/* Left - SOMA (Company Logo) */}
                    {typeof window !== 'undefined' && window.innerWidth > 639 ?
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
                            <Search className="h-4 w-4 text-primary" />
                        </Link>
                    )}


                    {/* Right - Buttons */}
                    <div className="flex items-center gap-2">

                        {/* Bell Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                            onClick={() => typeof window !== 'undefined' && window.innerWidth >= 768 ? setNotificationsModal(true) : router.push("/home/notifications")}
                        >
                            <Bell className="h-6 w-6" />
                        </Button>

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


                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-10 mt-[8rem] bg-background">
                <div className="flex gap-6">
                    {/* Left Section - 72% */}
                    <div className="w-full xl:w-[72%]">

                        <div>
                            {/* Political Parties Voting Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-primary mb-4">Political Parties & Their Manifestos</h2>

                                {/* Structure Tabs */}
                                <Tabs value={activeStructureTab} onValueChange={setActiveStructureTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="ISRC" className="text-sm font-medium">
                                            ISRC
                                        </TabsTrigger>
                                        {currentUser.structure && currentUser.structure !== 'ISRC' && (
                                            <TabsTrigger value={currentUser.structure} className="text-sm font-medium">
                                                {currentUser.structure}
                                            </TabsTrigger>
                                        )}
                                        {(!currentUser.structure || currentUser.structure === 'ISRC') && (
                                            <TabsTrigger value="all" className="text-sm font-medium">
                                                All Parties
                                            </TabsTrigger>
                                        )}
                                    </TabsList>

                                    {/* ISRC Tab */}
                                    <TabsContent value="ISRC" className="space-y-6">
                                        <div className="text-sm text-muted-foreground mb-4">
                                            ISRC parties available to all users across the institution
                                        </div>

                                        {/* Loading State */}
                                        {isLoadingParties && (
                                            <div className="flex items-center justify-center py-12">
                                                <div className="text-lg text-muted-foreground">Loading parties...</div>
                                            </div>
                                        )}

                                        {/* Error State */}
                                        {partiesError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                                <div className="text-red-600">{partiesError}</div>
                                            </div>
                                        )}

                                        {/* Dynamic Political Parties Grid */}
                                        {!isLoadingParties && !partiesError && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {getFilteredParties().filter(party => party.structure === 'ISRC' || !party.structure).map((party) => {
                                            const colors = getPartyColors(party.party_name);
                                            const manifestoPoints = getManifestoPoints(party.manifesto || null);
                                            
                                            return (
                                                <motion.div
                                                    key={party.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                            {party.logo ? (
                                                                <img
                                                                    src={party.logo}
                                                                    alt={`${party.party_name} Logo`}
                                                                    className="w-12 h-12 object-contain"
                                                                    onError={(e) => {
                                                                        // Fallback to party initials if logo fails to load
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.style.display = 'none';
                                                                        target.nextElementSibling?.classList.remove('hidden');
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div className={`${party.logo ? 'hidden' : ''} w-full h-full flex items-center justify-center text-blue-500 font-bold text-xl`}>
                                                                {party.party_name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-primary line-clamp-2">{party.party_name}</h3>
                                                            <p className="text-sm text-gray-600">{party.party_leader || 'No leader assigned'}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{party.votes} votes</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="text-sm text-gray-700">
                                                            <h4 className="font-medium mb-2">Key Manifesto Points:</h4>
                                                            <ul className="space-y-1 text-xs max-h-24 overflow-y-auto">
                                                                {manifestoPoints.map((point, index) => (
                                                                    <li key={index} className="leading-relaxed">
                                                                        {point.startsWith('•') ? point : `• ${point}`}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className={`w-full px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${colors.button}`}
                                                            onClick={() => console.log(`Voted for ${party.party_name}`)}
                                                        >
                                                            Vote for {party.party_name}
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                            </div>
                                        )}

                                        {/* No parties found */}
                                        {!isLoadingParties && !partiesError && getFilteredParties().filter(party => party.structure === 'ISRC' || !party.structure).length === 0 && (
                                            <div className="text-center py-12">
                                                <div className="text-lg text-muted-foreground">No ISRC parties available for voting</div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* User's Structure Tab */}
                                    {currentUser.structure && currentUser.structure !== 'ISRC' && (
                                        <TabsContent value={currentUser.structure} className="space-y-6">
                                            <div className="text-sm text-muted-foreground mb-4">
                                                {currentUser.structure} parties + ISRC parties available to your structure
                                            </div>

                                            {/* Loading State */}
                                            {isLoadingParties && (
                                                <div className="flex items-center justify-center py-12">
                                                    <div className="text-lg text-muted-foreground">Loading parties...</div>
                                                </div>
                                            )}

                                            {/* Error State */}
                                            {partiesError && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                                    <div className="text-red-600">{partiesError}</div>
                                                </div>
                                            )}

                                            {/* Dynamic Political Parties Grid */}
                                            {!isLoadingParties && !partiesError && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {getFilteredParties().filter(party => party.structure === currentUser.structure).map((party) => {
                                                        const colors = getPartyColors(party.party_name);
                                                        const manifestoPoints = getManifestoPoints(party.manifesto || null);

                                                        return (
                                                            <motion.div
                                                                key={party.id}
                                                                whileHover={{ scale: 1.02 }}
                                                                className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-4 mb-4">
                                                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                                        {party.logo ? (
                                                                            <img
                                                                                src={party.logo}
                                                                                alt={`${party.party_name} Logo`}
                                                                                className="w-12 h-12 object-contain"
                                                                                onError={(e) => {
                                                                                    // Fallback to party initials if logo fails to load
                                                                                    const target = e.target as HTMLImageElement;
                                                                                    target.style.display = 'none';
                                                                                    target.nextElementSibling?.classList.remove('hidden');
                                                                                }}
                                                                            />
                                                                        ) : null}
                                                                        <div className={`${party.logo ? 'hidden' : ''} w-full h-full flex items-center justify-center text-blue-500 font-bold text-xl`}>
                                                                            {party.party_name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="font-semibold text-primary line-clamp-2">{party.party_name}</h3>
                                                                        <p className="text-sm text-gray-600">{party.party_leader || 'No leader assigned'}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">{party.votes} votes</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="text-sm text-gray-700">
                                                                        <h4 className="font-medium mb-2">Key Manifesto Points:</h4>
                                                                        <ul className="space-y-1 text-xs max-h-24 overflow-y-auto">
                                                                            {manifestoPoints.map((point, index) => (
                                                                                <li key={index} className="leading-relaxed">
                                                                                    {point.startsWith('•') ? point : `• ${point}`}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className={`w-full px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${colors.button}`}
                                                                        onClick={() => console.log(`Voted for ${party.party_name}`)}
                                                                    >
                                                                        Vote for {party.party_name}
                                                                    </motion.button>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* No parties found */}
                                            {!isLoadingParties && !partiesError && getFilteredParties().filter(party => party.structure === currentUser.structure).length === 0 && (
                                                <div className="text-center py-12">
                                                    <div className="text-lg text-muted-foreground">No {currentUser.structure} parties available for voting</div>
                                                </div>
                                            )}
                                        </TabsContent>
                                    )}

                                    {/* All Parties Tab (fallback for users without structure or ISRC) */}
                                    {(!currentUser.structure || currentUser.structure === 'ISRC') && (
                                        <TabsContent value="all" className="space-y-6">
                                            <div className="text-sm text-muted-foreground mb-4">
                                                All parties available for voting (ISRC and general parties)
                                            </div>

                                            {/* Loading State */}
                                            {isLoadingParties && (
                                                <div className="flex items-center justify-center py-12">
                                                    <div className="text-lg text-muted-foreground">Loading parties...</div>
                                                </div>
                                            )}

                                            {/* Error State */}
                                            {partiesError && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                                    <div className="text-red-600">{partiesError}</div>
                                                </div>
                                            )}

                                            {/* Dynamic Political Parties Grid */}
                                            {!isLoadingParties && !partiesError && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {getFilteredParties().map((party) => {
                                                        const colors = getPartyColors(party.party_name);
                                                        const manifestoPoints = getManifestoPoints(party.manifesto || null);

                                                        return (
                                                            <motion.div
                                                                key={party.id}
                                                                whileHover={{ scale: 1.02 }}
                                                                className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
                                                            >
                                                                <div className="flex items-center gap-4 mb-4">
                                                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                                        {party.logo ? (
                                                                            <img
                                                                                src={party.logo}
                                                                                alt={`${party.party_name} Logo`}
                                                                                className="w-12 h-12 object-contain"
                                                                                onError={(e) => {
                                                                                    // Fallback to party initials if logo fails to load
                                                                                    const target = e.target as HTMLImageElement;
                                                                                    target.style.display = 'none';
                                                                                    target.nextElementSibling?.classList.remove('hidden');
                                                                                }}
                                                                            />
                                                                        ) : null}
                                                                        <div className={`${party.logo ? 'hidden' : ''} w-full h-full flex items-center justify-center text-blue-500 font-bold text-xl`}>
                                                                            {party.party_name.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="font-semibold text-primary line-clamp-2">{party.party_name}</h3>
                                                                        <p className="text-sm text-gray-600">{party.party_leader || 'No leader assigned'}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">{party.votes} votes</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="text-sm text-gray-700">
                                                                        <h4 className="font-medium mb-2">Key Manifesto Points:</h4>
                                                                        <ul className="space-y-1 text-xs max-h-24 overflow-y-auto">
                                                                            {manifestoPoints.map((point, index) => (
                                                                                <li key={index} className="leading-relaxed">
                                                                                    {point.startsWith('•') ? point : `• ${point}`}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    <motion.button
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        className={`w-full px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors ${colors.button}`}
                                                                        onClick={() => console.log(`Voted for ${party.party_name}`)}
                                                                    >
                                                                        Vote for {party.party_name}
                                                                    </motion.button>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* No parties found */}
                                            {!isLoadingParties && !partiesError && getFilteredParties().length === 0 && (
                                                <div className="text-center py-12">
                                                    <div className="text-lg text-muted-foreground">No parties available for voting</div>
                                                </div>
                                            )}
                                        </TabsContent>
                                    )}
                                </Tabs>

                                {/* Voting Instructions */}
                                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Voting Instructions</h3>
                                    <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                                        <p>• Click on the &quot;Vote for [Party Name]&quot; button to cast your vote</p>
                                        <p>• You can only vote once per election</p>
                                        <p>• Your vote is confidential and secure</p>
                                        <p>• Results will be announced after the voting period ends</p>
                                        <p>• Make sure to read each party&apos;s manifesto before voting</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>



                    {/* Right Section - 28% */}
                    <section className="hidden xl:block w-[28%] p-5 bg-muted fixed right-0 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {/* Leaderboard Heading */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-primary">Party Leaderboard</h2>
                                    <p className="text-xs text-muted-foreground">
                                        {leaderboardTab === 'ISRC' ? 'ISRC Parties Rankings' :
                                         leaderboardTab === currentUser.structure ? `${currentUser.structure} Parties Rankings` :
                                         'All Parties Rankings'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Tabs */}
                        <Tabs value={leaderboardTab} onValueChange={setLeaderboardTab} className="w-full mb-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="ISRC" className="text-xs">
                                    ISRC
                                </TabsTrigger>
                                {currentUser.structure && currentUser.structure !== 'ISRC' && (
                                    <TabsTrigger value={currentUser.structure} className="text-xs">
                                        {currentUser.structure}
                                    </TabsTrigger>
                                )}
                                {(!currentUser.structure || currentUser.structure === 'ISRC') && (
                                    <TabsTrigger value="all" className="text-xs">
                                        All Rankings
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </Tabs>

                        {/* Leaderboard Stats */}
                        <div className="bg-background rounded-lg p-4 mb-6 shadow-sm border">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {isLoadingParties ? '...' : getLeaderboardTotalVotes().toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {leaderboardTab === 'ISRC' ? 'ISRC Votes' :
                                         leaderboardTab === currentUser.structure ? `${currentUser.structure} Votes` :
                                         'Total Votes'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {isLoadingParties ? '...' : getLeaderboardFilteredParties().length}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {leaderboardTab === 'ISRC' ? 'ISRC Parties' :
                                         leaderboardTab === currentUser.structure ? `${currentUser.structure} Parties` :
                                         'Total Parties'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Party Rankings */}
                        <div className="space-y-3">
                            {/* Loading State */}
                            {isLoadingParties && (
                                <div className="text-center py-8">
                                    <div className="text-sm text-muted-foreground">Loading party rankings...</div>
                                </div>
                            )}

                            {/* Error State */}
                            {partiesError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-red-600 text-sm">{partiesError}</div>
                                </div>
                            )}

                            {/* Dynamic Party Rankings */}
                            {!isLoadingParties && !partiesError && getLeaderboardFilteredParties().map((party, index) => {
                                const rank = index + 1;
                                const totalVotes = getLeaderboardTotalVotes();
                                const percentage = getLeaderboardVotePercentage(party.votes);
                                const colors = getRankColors(rank);
                                const shortName = getPartyShortName(party.party_name);
                                const partyColors = getPartyColors(party.party_name);

                                return (
                                    <motion.div
                                        key={party.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-background rounded-lg p-4 shadow-sm border ${colors.border} hover:shadow-md transition-all cursor-pointer`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} font-bold text-sm`}>
                                                {rank}
                                            </div>
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                    {party.logo ? (
                                                        <img
                                                            src={party.logo}
                                                            alt={`${party.party_name} Logo`}
                                                            className="w-8 h-8 object-contain"
                                                            onError={(e) => {
                                                                // Fallback to party initials if logo fails
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                target.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`${party.logo ? 'hidden' : ''} w-full h-full flex items-center justify-center text-blue-500 font-bold text-xs`}>
                                                        {shortName.split(' ').map(word => word.charAt(0)).join('').slice(0, 3)}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-primary text-sm">{shortName}</h3>
                                                    <p className="text-xs text-gray-600">{party.party_leader || 'No leader assigned'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${colors.text}`}>
                                                    {party.votes.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-600">{percentage}%</div>
                                            </div>
                                        </div>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`${colors.progress} h-2 rounded-full transition-all duration-500`} 
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* No parties found */}
                            {!isLoadingParties && !partiesError && getLeaderboardFilteredParties().length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-sm text-muted-foreground">No parties available</div>
                                </div>
                            )}
                        </div>

                        {/* Last Updated */}
                        <div className="mt-6 text-center">
                            <div className="mb-2">
                                <span className="text-xs font-medium text-primary">
                                    {leaderboardTab === 'ISRC' ? 'ISRC Rankings' :
                                     leaderboardTab === currentUser.structure ? `${currentUser.structure} Rankings` :
                                     'All Rankings'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Last updated: {new Date().toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </section>
                </div>

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
    );
} 
