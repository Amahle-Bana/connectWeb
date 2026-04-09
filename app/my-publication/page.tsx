"use client"

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/auth-context';
import { useAppSelector } from "@/redux/hooks";
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Bell, ChevronLeftIcon, ChevronRightIcon, Compass, LayoutDashboard, Mail, Moon, Search, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRef, useState, useMemo } from 'react';
import router from 'next/router';
import useWindowSize from '@/hooks/useWindow';
import { useTheme } from "next-themes";
import { SearchQueryDialog } from "@/components/HomePage/searchQueryDialog";
import { NotificationsDialog } from "@/components/HomePage/notificationsDialog";
import { Label } from '@/components/ui/label';
import { IconBook, IconBookmark, IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandThreads, IconBrandTiktok, IconBrandX, IconBrandYoutube, IconWorld } from '@tabler/icons-react';



// Search Categories
const searchCategories = [
    "All",
    "Writers",
    "Articles",
    "Magazines",
    "Podcasts",
]

const notificationCategories = [
    "All",
    "Notifications",
    "Messages",
    "Requests",
    "Comments",
    "Likes",
]


// Home Page Function
export default function HomePage() {

    // Get user data from Redux
    const { isAuthenticated } = useAuth();
    const currentUser = useAppSelector((state) => state.user);

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

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

    // useWindowSize
    const { width } = useWindowSize();

    // activeCategory useState()
    const [activeCategory, setActiveCategory] = useState("Home");

    // mounted useState()
    const [mounted, setMounted] = useState(false);

    // setTheme useTheme()
    const { setTheme } = useTheme();

    const currentUserCategories = ['Home', 'Articles', 'Magazines', 'Podcasts', 'Stats', 'Subscribers', 'Recommendations', 'Settings'];

    // active tab for Articles section
    const [activeArticlesTab, setActiveArticlesTab] = useState("Published");

    // active tab for Magazines Section
    const [activeMagazinesTab, setActiveMagazinesTab] = useState("Published");

    // active tab for Podcasts Section
    const [activePodcastsTab, setActivePodcastsTab] = useState("Published");

    // active tab for Subscribers Section 
    const [activeSubscriberTab, setActiveSubscriberTab] = useState("Impressions")

    // active tab for Stats Section
    const [activeStatsTab, setActiveStatsTab] = useState("Network");


    // Articles filter states
    const [articlesFilterDropdownOpen, setArticlesFilterDropdownOpen] = useState(false);
    const [articlesFilterFromDate, setArticlesFilterFromDate] = useState("");
    const [articlesFilterToDate, setArticlesFilterToDate] = useState("");
    const [articlesFilterAudience, setArticlesFilterAudience] = useState("Everyone");
    const [articlesFilterPostType, setArticlesFilterPostType] = useState<string[]>([]);
    const [artcilesSortOrder, setArticlesSortOrder] = useState<'Newest' | 'Oldest'>('Newest');

    // Magazines filter states
    const [magazinesFilterDropdownOpen, setMagazinesFilterDropdownOpen] = useState(false);
    const [magazinesFilterFromDate, setMagazinesFilterFromDate] = useState("");
    const [magazinesFilterToDate, setMagazinesFilterToDate] = useState("");
    const [magazinesFilterAudience, setMagazinesFilterAudience] = useState("Everyone");
    const [magazinesFilterPostType, setMagazinesFilterPostType] = useState<string[]>([]);
    const [magazineSortOrder, setMagazineSortOrder] = useState<'Newest' | 'Oldest'>('Newest');

    // Podcasts filter states
    const [podcastsFilterDropdownOpen, setPodcastsFilterDropdownOpen] = useState(false);
    const [podcastsFilterFromDate, setPodcastsFilterFromDate] = useState("");
    const [podcastsFilterToDate, setPodcastsFilterToDate] = useState("");
    const [podcastsFilterAudience, setPodcastsFilterAudience] = useState("Everyone");
    const [podcastsFilterPostType, setPodcastsFilterPostType] = useState<string[]>([]);
    const [podcastsSortOrder, setPodcastsSortOrder] = useState<'Newest' | 'Oldest'>('Newest');

    // Helper for toggling post type
    const togglePostType = (type: string) => {
        setMagazinesFilterPostType((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    // Articles Clear All Filter 
    const clearArticlesAllFilters = () => {
        setArticlesFilterFromDate("");
        setArticlesFilterToDate("");
        setArticlesFilterAudience("Everyone");
        setArticlesFilterPostType([]);
    };

    const clearMagazinesAllFilters = () => {
        setMagazinesFilterFromDate("");
        setMagazinesFilterToDate("");
        setMagazinesFilterAudience("Everyone");
        setMagazinesFilterPostType([]);
    };

    const clearPodcastsAllFilters = () => {
        setPodcastsFilterFromDate("");
        setPodcastsFilterToDate("");
        setPodcastsFilterAudience("Everyone");
        setPodcastsFilterPostType([]);
    };

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

    // Add state for sidebar search and selected option
    const [settingsSearch, setSettingsSearch] = useState("");
    const [selectedSettingsOption, setSelectedSettingsOption] = useState("Basics");

    const settingsOptions = [
        "Basics",
        "Payments",
        "Branding",
        "Growth features",
        "Emails",
        "Community",
        "Chat",
        "Live video",
        "Podcasts",
        "Sections",
        "Team",
        "Privacy",
        "Notifications",
        "Connected accounts",
        "Domain",
        "Analytics",
        "Details",
        "Import / Export",
        "Danger Zone"
    ];

    const filteredSettingsOptions = useMemo(() =>
        settingsOptions.filter(option =>
            option.toLowerCase().includes(settingsSearch.toLowerCase())
        ),
        [settingsSearch]
    );



    // return
    return (
        <div className="flex flex-col min-h-screen bg-muted font-playfair-display">

            {/* Header */}
            <header className="bg-white fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    {/* Left - SOMA (Company Logo) */}
                    {typeof window !== 'undefined' && window.innerWidth > 639 ?

                        <img src="https://source.unsplash.com/random/40x40" alt="Random Logo" className="h-10 w-10 object-contain rounded-md border border-red-500" />
                        :
                        <div className="flex flex-row align-items justify-center">
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
                            <h1 className="text-lg font-semibold text-secondary">SOMA</h1>
                        </div>
                    }

                    {/* Middle - Search Bar */}
                    {typeof window !== 'undefined' && window.innerWidth >= 500 ? (
                        <div className="flex flex-row align-items justify-center max-w-xl mx-2 bg-background">
                            <h1 className="text-bold">{"Amahle Bana's Soma"}</h1>
                        </div>
                    ) : (
                        <Link href="/home/search" className="ml-auto mr-2">
                            <Search className="h-4 w-4 text-primary" />
                        </Link>
                    )}


                    {/* Right - Buttons */}
                    <div className="flex items-center gap-2">

                        {/* Dashboard/Login Button */}
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                {typeof window !== 'undefined' && width < 600 ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-gray-200 rounded-sm"
                                    >
                                        <LayoutDashboard className="h-6 w-6" />
                                    </Button>
                                ) : (
                                    <Button
                                        className={`bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-sm cursor-pointer`}
                                        size="sm"
                                    >
                                        Dashboard
                                    </Button>
                                )}
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button
                                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-sm cursor-pointer"
                                    size="sm"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}

                        {/* Bell Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                            onClick={() => typeof window !== 'undefined' && window.innerWidth >= 768 ? setNotificationsModal(true) : router.push("/home/notifications")}
                        >
                            <Search className="h-6 w-6" />
                        </Button>

                        {/* Bell Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                            onClick={() => typeof window !== 'undefined' && window.innerWidth >= 768 ? setNotificationsModal(true) : router.push("/home/notifications")}
                        >
                            <Bell className="h-6 w-6" />
                        </Button>

                        {/* Mail Button */}
                        {isAuthenticated && (
                            <Link href="/home/chat">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                                >
                                    <Mail className="h-6 w-6" />
                                </Button>
                            </Link>
                        )}

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
                                <DropdownMenuContent align="end">
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

                {/* Categories Container */}
                <div
                    ref={categoriesScrollRef}
                    className="border border-red-500 flex items-center justify-center space-x-2 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {currentUserCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === category
                                ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-sm"
                                : "text-primary bg-muted hover:text-blue-600 hover:bg-muted px-4 py-2 rounded-sm"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex bg-muted mt-[6rem]">

                {/* Left Section - 20% */}
                <section className=" border border-red-500 hidden xl:block w-[20%] border-r bg-muted p-4 fixed h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


                </section>

                {/* Middle Section - 50% */}
                <section className="w-full xl:w-[50%] xl:ml-[20%] border-r bg-muted p-4 sm:p-6 md:p-8 xl:p-10 overflow-y-auto">

                    {/* 'Home' Tab */}
                    {activeCategory === "Home" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Home</Button>
                                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" size="sm">Create</Button>
                                </div>
                            </div>

                            {/* Dashboard Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-muted-foreground">All Subscribers</h3>
                                    <p className="text-2xl font-bold text-primary">0</p>
                                    <p className="text-xs text-green-600">0% from last month</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-muted-foreground">Last 30 Days Views</h3>
                                    <p className="text-2xl font-bold text-primary">0</p>
                                    <p className="text-xs text-green-600">0% from last month</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-muted-foreground">Open Rate</h3>
                                    <p className="text-2xl font-bold text-primary">0%</p>
                                    <p className="text-xs text-green-600">0% from last month</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-sm font-medium text-muted-foreground">In-App Impressions</h3>
                                    <p className="text-2xl font-bold text-primary">%</p>
                                    <p className="text-xs text-green-600">0% from last month</p>
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-primary">Recent Posts</h2>
                                    <Button variant="outline" size="sm">View All</Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">The Future of Digital Publishing</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 15, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">1.2k views</span>
                                                <span className="text-xs text-muted-foreground">45 comments</span>
                                                <span className="text-xs text-muted-foreground">12 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Getting Started with SOMA</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 10, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">856 views</span>
                                                <span className="text-xs text-muted-foreground">23 comments</span>
                                                <span className="text-xs text-muted-foreground">8 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Content Creation Best Practices</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 5, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">2.1k views</span>
                                                <span className="text-xs text-muted-foreground">67 comments</span>
                                                <span className="text-xs text-muted-foreground">34 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Drafts */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-primary">Drafts</h2>
                                    <Button variant="outline" size="sm">View All</Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">AI in Modern Publishing</h3>
                                            <p className="text-sm text-muted-foreground">Last edited on March 18, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">75% complete</span>
                                                <span className="text-xs text-muted-foreground">2,450 words</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Continue</Button>
                                            <Button variant="outline" size="sm">Preview</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Building Your Author Brand</h3>
                                            <p className="text-sm text-muted-foreground">Last edited on March 16, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">45% complete</span>
                                                <span className="text-xs text-muted-foreground">1,200 words</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Continue</Button>
                                            <Button variant="outline" size="sm">Preview</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Monetization Strategies for Writers</h3>
                                            <p className="text-sm text-muted-foreground">Last edited on March 14, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">90% complete</span>
                                                <span className="text-xs text-muted-foreground">3,100 words</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Continue</Button>
                                            <Button variant="outline" size="sm">Preview</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 'Articles' Tab */}
                    {activeCategory === "Articles" && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-primary">My Articles</h1>
                                <div className="flex gap-2">
                                    <Link href="/post">
                                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" size="sm">Create New Article</Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex space-x-1 mb-6">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeArticlesTab === "Published" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveArticlesTab("Published")}
                                    >
                                        Published
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeArticlesTab === "Scheduled" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveArticlesTab("Scheduled")}
                                    >
                                        Scheduled
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeArticlesTab === "Drafts" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveArticlesTab("Drafts")}
                                    >
                                        Drafts
                                    </button>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search articles..." className="pl-10" />
                                    </div>
                                    {/* Filter Dropdown */}
                                    <DropdownMenu open={articlesFilterDropdownOpen} onOpenChange={setArticlesFilterDropdownOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">Filter</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-80 p-4 space-y-4">
                                            {/* Date Range */}
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">From</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={articlesFilterFromDate}
                                                        onChange={e => setArticlesFilterFromDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">To</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={articlesFilterToDate}
                                                        onChange={e => setArticlesFilterToDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {/* Audience */}
                                            <div>
                                                <label className="block text-xs mb-1">Audience</label>
                                                <div className="flex gap-2">
                                                    {['Everyone', 'Subscribers', 'Paid'].map(aud => (
                                                        <button
                                                            key={aud}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${articlesFilterAudience === aud ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setArticlesFilterAudience(aud)}
                                                        >
                                                            {aud}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Post Type */}
                                            <div>
                                                <label className="block text-xs mb-1">Post type</label>
                                                <div className="flex gap-2 flex-wrap">
                                                    {['Article', 'Magazines', 'Podcasts'].map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${articlesFilterPostType.includes(type) ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setArticlesFilterPostType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Author */}
                                            <div>
                                                <label className="block text-xs mb-1">Author</label>
                                                <div className="flex items-center gap-2">
                                                    {currentUser.profilePicture ? (
                                                        <img src={currentUser.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">
                                                            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm">{currentUser.fullName || currentUser.username}</span>
                                                </div>
                                            </div>
                                            {/* Footer Buttons */}
                                            <div className="flex justify-between pt-2 border-t mt-2">
                                                <Button variant="ghost" size="sm" onClick={clearArticlesAllFilters}>Clear all</Button>
                                                <Button size="sm" onClick={() => setArticlesFilterDropdownOpen(false)}>Done</Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/* Sort Order Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => setArticlesSortOrder(artcilesSortOrder === 'Newest' ? 'Oldest' : 'Newest')}
                                    >
                                        {artcilesSortOrder}
                                    </Button>
                                </div>

                                {/* Articles List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">The Future of Digital Publishing</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 15, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">1.2k views</span>
                                                <span className="text-xs text-muted-foreground">45 comments</span>
                                                <span className="text-xs text-muted-foreground">12 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Getting Started with SOMA</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 10, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">856 views</span>
                                                <span className="text-xs text-muted-foreground">23 comments</span>
                                                <span className="text-xs text-muted-foreground">8 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Content Creation Best Practices</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 5, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">2.1k views</span>
                                                <span className="text-xs text-muted-foreground">67 comments</span>
                                                <span className="text-xs text-muted-foreground">34 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 'Magazines' Tab */}
                    {activeCategory === "Magazines" && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-primary">My Magazines</h1>
                                <div className="flex gap-2">
                                    <Link href="/post/magazine">
                                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" size="sm">Create New Magazine</Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex space-x-1 mb-6">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeMagazinesTab === "Published" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveMagazinesTab("Published")}
                                    >
                                        Published
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeMagazinesTab === "Scheduled" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveMagazinesTab("Scheduled")}
                                    >
                                        Scheduled
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeMagazinesTab === "Drafts" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveMagazinesTab("Drafts")}
                                    >
                                        Drafts
                                    </button>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search Magazines..." className="pl-10" />
                                    </div>
                                    {/* Filter Dropdown */}
                                    <DropdownMenu open={magazinesFilterDropdownOpen} onOpenChange={setMagazinesFilterDropdownOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">Filter</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-80 p-4 space-y-4">
                                            {/* Date Range */}
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">From</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={magazinesFilterFromDate}
                                                        onChange={e => setMagazinesFilterFromDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">To</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={magazinesFilterToDate}
                                                        onChange={e => setMagazinesFilterToDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {/* Audience */}
                                            <div>
                                                <label className="block text-xs mb-1">Audience</label>
                                                <div className="flex gap-2">
                                                    {['Everyone', 'Subscribers', 'Paid'].map(aud => (
                                                        <button
                                                            key={aud}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${magazinesFilterAudience === aud ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setMagazinesFilterAudience(aud)}
                                                        >
                                                            {aud}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Post Type */}
                                            <div>
                                                <label className="block text-xs mb-1">Post type</label>
                                                <div className="flex gap-2 flex-wrap">
                                                    {['Article', 'Magazines', 'Podcasts'].map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${magazinesFilterPostType.includes(type) ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setMagazinesFilterPostType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Author */}
                                            <div>
                                                <label className="block text-xs mb-1">Author</label>
                                                <div className="flex items-center gap-2">
                                                    {currentUser.profilePicture ? (
                                                        <img src={currentUser.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">
                                                            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm">{currentUser.fullName || currentUser.username}</span>
                                                </div>
                                            </div>
                                            {/* Footer Buttons */}
                                            <div className="flex justify-between pt-2 border-t mt-2">
                                                <Button variant="ghost" size="sm" onClick={clearMagazinesAllFilters}>Clear all</Button>
                                                <Button size="sm" onClick={() => setMagazinesFilterDropdownOpen(false)}>Done</Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/* Sort Order Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => setMagazineSortOrder(magazineSortOrder === 'Newest' ? 'Oldest' : 'Newest')}
                                    >
                                        {magazineSortOrder}
                                    </Button>
                                </div>

                                {/* Articles List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">The Future of Digital Publishing</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 15, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">1.2k views</span>
                                                <span className="text-xs text-muted-foreground">45 comments</span>
                                                <span className="text-xs text-muted-foreground">12 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Getting Started with SOMA</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 10, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">856 views</span>
                                                <span className="text-xs text-muted-foreground">23 comments</span>
                                                <span className="text-xs text-muted-foreground">8 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Content Creation Best Practices</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 5, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">2.1k views</span>
                                                <span className="text-xs text-muted-foreground">67 comments</span>
                                                <span className="text-xs text-muted-foreground">34 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 'Podcasts' Tab */}
                    {activeCategory === "Podcasts" && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-primary">My Podcasts</h1>
                                <div className="flex gap-2">
                                    <Link href="/post/podcast">
                                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90" size="sm">Create New Podcasts</Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex space-x-1 mb-6">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activePodcastsTab === "Published" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActivePodcastsTab("Published")}
                                    >
                                        Published
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activePodcastsTab === "Scheduled" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActivePodcastsTab("Scheduled")}
                                    >
                                        Scheduled
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activePodcastsTab === "Drafts" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActivePodcastsTab("Drafts")}
                                    >
                                        Drafts
                                    </button>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search Podcasts..." className="pl-10" />
                                    </div>
                                    {/* Filter Dropdown */}
                                    <DropdownMenu open={podcastsFilterDropdownOpen} onOpenChange={setPodcastsFilterDropdownOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">Filter</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-80 p-4 space-y-4">
                                            {/* Date Range */}
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">From</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={podcastsFilterFromDate}
                                                        onChange={e => setPodcastsFilterFromDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">To</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={podcastsFilterToDate}
                                                        onChange={e => setPodcastsFilterToDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {/* Audience */}
                                            <div>
                                                <label className="block text-xs mb-1">Audience</label>
                                                <div className="flex gap-2">
                                                    {['Everyone', 'Subscribers', 'Paid'].map(aud => (
                                                        <button
                                                            key={aud}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${podcastsFilterAudience === aud ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setPodcastsFilterAudience(aud)}
                                                        >
                                                            {aud}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Post Type */}
                                            <div>
                                                <label className="block text-xs mb-1">Post type</label>
                                                <div className="flex gap-2 flex-wrap">
                                                    {['Article', 'Magazines', 'Podcasts'].map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${podcastsFilterPostType.includes(type) ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setPodcastsFilterPostType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Author */}
                                            <div>
                                                <label className="block text-xs mb-1">Author</label>
                                                <div className="flex items-center gap-2">
                                                    {currentUser.profilePicture ? (
                                                        <img src={currentUser.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">
                                                            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm">{currentUser.fullName || currentUser.username}</span>
                                                </div>
                                            </div>
                                            {/* Footer Buttons */}
                                            <div className="flex justify-between pt-2 border-t mt-2">
                                                <Button variant="ghost" size="sm" onClick={clearPodcastsAllFilters}>Clear all</Button>
                                                <Button size="sm" onClick={() => setPodcastsFilterDropdownOpen(false)}>Done</Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/* Sort Order Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => setPodcastsSortOrder(podcastsSortOrder === 'Newest' ? 'Oldest' : 'Newest')}
                                    >
                                        {podcastsSortOrder}
                                    </Button>
                                </div>

                                {/* Podcasts List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">The Future of Digital Publishing</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 15, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">1.2k views</span>
                                                <span className="text-xs text-muted-foreground">45 comments</span>
                                                <span className="text-xs text-muted-foreground">12 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Getting Started with SOMA</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 10, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">856 views</span>
                                                <span className="text-xs text-muted-foreground">23 comments</span>
                                                <span className="text-xs text-muted-foreground">8 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Content Creation Best Practices</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 5, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">2.1k views</span>
                                                <span className="text-xs text-muted-foreground">67 comments</span>
                                                <span className="text-xs text-muted-foreground">34 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 'Stats' Tab */}
                    {activeCategory === "Stats" && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-primary">Statistics</h1>

                            {/* Tab Navigation */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex space-x-1 mb-6 overflow-x-auto">
                                    {['Network', 'Audience', 'Pledges', 'Sharing', 'Traffic', 'Email', 'Surveys'].map(tab => (
                                        <button
                                            key={tab}
                                            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${activeStatsTab === tab ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
                                            onClick={() => setActiveStatsTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Network' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-primary">Network Statistics</h3>
                                            <select className="px-3 py-2 border rounded-md text-sm">
                                                <option>7 days</option>
                                                <option>30 days</option>
                                                <option>90 days</option>
                                                <option>All time</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Total Connections</h3>
                                                <p className="text-2xl font-bold text-primary">1,247</p>
                                                <p className="text-xs text-green-600">+23% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Active Collaborators</h3>
                                                <p className="text-2xl font-bold text-primary">89</p>
                                                <p className="text-xs text-green-600">+8% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Network Growth</h3>
                                                <p className="text-2xl font-bold text-primary">15.2%</p>
                                                <p className="text-xs text-green-600">+2.1% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Engagement Score</h3>
                                                <p className="text-2xl font-bold text-primary">8.7/10</p>
                                                <p className="text-xs text-green-600">+0.3 from last month</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Audience' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-primary">Network Statistics</h3>
                                            <div>
                                                <select className="px-3 py-2 border rounded-md text-sm">
                                                    <option>7 days</option>
                                                    <option>30 days</option>
                                                    <option>90 days</option>
                                                    <option>All time</option>
                                                </select>
                                                <select className="px-3 py-2 border rounded-md text-sm">
                                                    <option>Global</option>
                                                    <option>US</option>
                                                </select>
                                                <select className="px-3 py-2 border rounded-md text-sm">
                                                    <option>Subscribers</option>
                                                    <option>Paid</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Total Connections</h3>
                                                <p className="text-2xl font-bold text-primary">1,247</p>
                                                <p className="text-xs text-green-600">+23% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Active Collaborators</h3>
                                                <p className="text-2xl font-bold text-primary">89</p>
                                                <p className="text-xs text-green-600">+8% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Network Growth</h3>
                                                <p className="text-2xl font-bold text-primary">15.2%</p>
                                                <p className="text-xs text-green-600">+2.1% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Engagement Score</h3>
                                                <p className="text-2xl font-bold text-primary">8.7/10</p>
                                                <p className="text-xs text-green-600">+0.3 from last month</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Pledges' && (
                                    <div className="space-y-6">

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Sharing' && (
                                    <div className="space-y-6">

                                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-primary">Top sharers</h2>
                                                    <p className="text-sm text-muted-foreground">See who is sharing your publication and recruiting new subscribers.</p>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                                    <input
                                                        type="date"
                                                        className="border rounded px-3 py-2 text-sm"
                                                        value={podcastsFilterFromDate}
                                                        onChange={e => setPodcastsFilterFromDate(e.target.value)}
                                                    />
                                                    <span className="mx-1 text-muted-foreground">to</span>
                                                    <input
                                                        type="date"
                                                        className="border rounded px-3 py-2 text-sm"
                                                        value={podcastsFilterToDate}
                                                        onChange={e => setPodcastsFilterToDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Traffic' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Total Connections</h3>
                                                <p className="text-2xl font-bold text-primary">1,247</p>
                                                <p className="text-xs text-green-600">+23% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Active Collaborators</h3>
                                                <p className="text-2xl font-bold text-primary">89</p>
                                                <p className="text-xs text-green-600">+8% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Network Growth</h3>
                                                <p className="text-2xl font-bold text-primary">15.2%</p>
                                                <p className="text-xs text-green-600">+2.1% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Engagement Score</h3>
                                                <p className="text-2xl font-bold text-primary">8.7/10</p>
                                                <p className="text-xs text-green-600">+0.3 from last month</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Email' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Total Connections</h3>
                                                <p className="text-2xl font-bold text-primary">1,247</p>
                                                <p className="text-xs text-green-600">+23% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Active Collaborators</h3>
                                                <p className="text-2xl font-bold text-primary">89</p>
                                                <p className="text-xs text-green-600">+8% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Network Growth</h3>
                                                <p className="text-2xl font-bold text-primary">15.2%</p>
                                                <p className="text-xs text-green-600">+2.1% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Engagement Score</h3>
                                                <p className="text-2xl font-bold text-primary">8.7/10</p>
                                                <p className="text-xs text-green-600">+0.3 from last month</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Tab Content */}
                                {activeStatsTab === 'Surveys' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Total Connections</h3>
                                                <p className="text-2xl font-bold text-primary">1,247</p>
                                                <p className="text-xs text-green-600">+23% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Active Collaborators</h3>
                                                <p className="text-2xl font-bold text-primary">89</p>
                                                <p className="text-xs text-green-600">+8% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Network Growth</h3>
                                                <p className="text-2xl font-bold text-primary">15.2%</p>
                                                <p className="text-xs text-green-600">+2.1% from last month</p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg">
                                                <h3 className="text-sm font-medium text-muted-foreground">Engagement Score</h3>
                                                <p className="text-2xl font-bold text-primary">8.7/10</p>
                                                <p className="text-xs text-green-600">+0.3 from last month</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-primary mb-4">Top Network Connections</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JD</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">John Doe</h4>
                                                            <p className="text-sm text-muted-foreground">Tech Writer</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">156 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">JS</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Jane Smith</h4>
                                                            <p className="text-sm text-muted-foreground">Content Creator</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">134 interactions</span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">MJ</div>
                                                        <div>
                                                            <h4 className="font-medium text-primary">Mike Johnson</h4>
                                                            <p className="text-sm text-muted-foreground">Publisher</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">98 interactions</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Add similar conditional rendering for other tabs if needed */}
                            </div>
                        </div>
                    )}

                    {/*  */}
                    {activeCategory === "Subscribers" && (
                        <div className="space-y-6">
                            {/* Tabs */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex space-x-1 mb-6">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeSubscriberTab === "Impressions" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveSubscriberTab("Impressions")}
                                    >
                                        Impressions
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeSubscriberTab === "All Subscribers" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveSubscriberTab("All Subscribers")}
                                    >
                                        All Subscribers
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeSubscriberTab === "Paid" ? "text-blue-600 bg-blue-50" : "text-muted-foreground hover:text-blue-600"}`}
                                        onClick={() => setActiveSubscriberTab("Paid")}
                                    >
                                        Paid
                                    </button>
                                </div>

                                {/* Search and Filter */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="Search Subscribers..." className="pl-10" />
                                    </div>
                                    {/* Filter Dropdown */}
                                    <DropdownMenu open={magazinesFilterDropdownOpen} onOpenChange={setMagazinesFilterDropdownOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="sm">Filter</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-80 p-4 space-y-4">
                                            {/* Date Range */}
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">From</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={magazinesFilterFromDate}
                                                        onChange={e => setMagazinesFilterFromDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs mb-1">To</label>
                                                    <input
                                                        type="date"
                                                        className="w-full border rounded px-2 py-1 text-sm"
                                                        value={magazinesFilterToDate}
                                                        onChange={e => setMagazinesFilterToDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            {/* Audience */}
                                            <div>
                                                <label className="block text-xs mb-1">Audience</label>
                                                <div className="flex gap-2">
                                                    {['Everyone', 'Subscribers', 'Paid'].map(aud => (
                                                        <button
                                                            key={aud}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${magazinesFilterAudience === aud ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setMagazinesFilterAudience(aud)}
                                                        >
                                                            {aud}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Post Type */}
                                            <div>
                                                <label className="block text-xs mb-1">Post type</label>
                                                <div className="flex gap-2 flex-wrap">
                                                    {['Article', 'Magazines', 'Podcasts'].map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            className={`px-3 py-1 rounded text-sm border ${magazinesFilterPostType.includes(type) ? 'bg-primary text-white' : 'bg-white text-primary'}`}
                                                            onClick={() => setMagazinesFilterPostType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Author */}
                                            <div>
                                                <label className="block text-xs mb-1">Author</label>
                                                <div className="flex items-center gap-2">
                                                    {currentUser.profilePicture ? (
                                                        <img src={currentUser.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold">
                                                            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : currentUser.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm">{currentUser.fullName || currentUser.username}</span>
                                                </div>
                                            </div>
                                            {/* Footer Buttons */}
                                            <div className="flex justify-between pt-2 border-t mt-2">
                                                <Button variant="ghost" size="sm" onClick={clearMagazinesAllFilters}>Clear all</Button>
                                                <Button size="sm" onClick={() => setMagazinesFilterDropdownOpen(false)}>Done</Button>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {/* Sort Order Button */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="ml-2"
                                        onClick={() => setMagazineSortOrder(magazineSortOrder === 'Newest' ? 'Oldest' : 'Newest')}
                                    >
                                        {magazineSortOrder}
                                    </Button>
                                </div>

                                {/* Articles List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">The Future of Digital Publishing</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 15, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">1.2k views</span>
                                                <span className="text-xs text-muted-foreground">45 comments</span>
                                                <span className="text-xs text-muted-foreground">12 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Getting Started with SOMA</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 10, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">856 views</span>
                                                <span className="text-xs text-muted-foreground">23 comments</span>
                                                <span className="text-xs text-muted-foreground">8 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-primary">Content Creation Best Practices</h3>
                                            <p className="text-sm text-muted-foreground">Published on March 5, 2024</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-muted-foreground">2.1k views</span>
                                                <span className="text-xs text-muted-foreground">67 comments</span>
                                                <span className="text-xs text-muted-foreground">34 likes</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Edit</Button>
                                            <Button variant="outline" size="sm">View</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {activeCategory === "Recommendations" && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-primary">Recommendations</h1>
                            {/* Top Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center mb-2">
                                <h2 className="text-xl font-bold mb-2">Recommend other Substacks</h2>
                                <p className="text-sm text-muted-foreground mb-6 max-w-md">Help your subscribers find other great Substacks by recommending your favorites. <a href="#" className="underline">Learn more</a></p>
                                <Button className="w-full max-w-xs bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 px-4 rounded-lg text-base">Add recommendation</Button>
                            </div>
                            {/* Suggested List */}
                            <div className="bg-white rounded-2xl shadow p-6">
                                <div className="text-xs text-muted-foreground font-semibold mb-4 tracking-widest">SUGGESTED</div>
                                <div className="space-y-4">
                                    {/* Example suggestions, replace with dynamic data if available */}
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img src="https://substackcdn.com/image/fetch/w_48,c_fill,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6e2e2e2-1b2a-4e2e-8e2e-2e2e2e2e2e2e_48x48.png" alt="Racket News" className="h-10 w-10 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold text-sm">Racket News</div>
                                                <div className="text-xs text-muted-foreground">By Matt Taibbi</div>
                                            </div>
                                        </div>
                                        <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-4 py-1.5 rounded-lg text-sm">Recommend</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img src="https://substackcdn.com/image/fetch/w_48,c_fill,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff7e2e2e2-1b2a-4e2e-8e2e-2e2e2e2e2e2e_48x48.png" alt="First 1000" className="h-10 w-10 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold text-sm">First 1000</div>
                                                <div className="text-xs text-muted-foreground">By Ali A.</div>
                                            </div>
                                        </div>
                                        <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-4 py-1.5 rounded-lg text-sm">Recommend</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <img src="https://substackcdn.com/image/fetch/w_48,c_fill,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff8e2e2e2-1b2a-4e2e-8e2e-2e2e2e2e2e2e_48x48.png" alt="Huddle Up" className="h-10 w-10 rounded-full object-cover" />
                                            <div>
                                                <div className="font-semibold text-sm">Huddle Up</div>
                                                <div className="text-xs text-muted-foreground">By Joe Pompliano</div>
                                            </div>
                                        </div>
                                        <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-4 py-1.5 rounded-lg text-sm">Recommend</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeCategory === "Settings" && (
                        <div className="flex w-full min-h-[600px] bg-background rounded-lg shadow-sm overflow-hidden">
                            {/* Sidebar */}
                            <aside className="w-64 border-r bg-background flex flex-col p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                                <Input
                                    placeholder="Search settings..."
                                    className="mb-4"
                                    value={settingsSearch}
                                    onChange={e => setSettingsSearch(e.target.value)}
                                />
                                <nav className="flex-1 space-y-1">
                                    {filteredSettingsOptions.map(option => (
                                        <button
                                            key={option}
                                            className={`w-full text-left px-4 py-2 rounded transition-colors font-medium ${selectedSettingsOption === option ? 'bg-blue-50 text-blue-600' : 'hover:bg-muted text-primary'}`}
                                            onClick={() => setSelectedSettingsOption(option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </nav>
                            </aside>


                            {/* Main Content */}
                            <section className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                                {selectedSettingsOption === "Basics" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary">
                                        <h2 className="text-2xl font-bold mb-6">Basics</h2>
                                        <form className="space-y-6">
                                            {/* Publication name */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2" htmlFor="publicationName">Publication name</label>
                                                <input
                                                    id="publicationName"
                                                    type="text"
                                                    className="w-full rounded-md border border-gray-700 bg-background text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Amahle's Substack"
                                                />
                                            </div>
                                            {/* Publication short description */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2" htmlFor="publicationDescription">Publication short description</label>
                                                <span className="block text-xs text-gray-400 mb-1">Add a single sentence that succinctly explains what your publication is about.</span>
                                                <textarea
                                                    id="publicationDescription"
                                                    className="w-full rounded-md border border-gray-700 bg-background text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                                                    placeholder="My personal Substack"
                                                />
                                            </div>
                                            {/* Publication logo */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-semibold mb-2">Publication logo</label>
                                                    <span className="block text-xs text-gray-400 mb-1">Square image at least 256x256 pixels</span>
                                                    <input type="file" accept="image/*" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                                </div>
                                                {/* Example logo preview */}
                                                <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-700 flex items-center justify-center bg-white">
                                                    <img src="/somaweb/public/somasvg.svg" alt="Logo preview" className="object-contain w-full h-full" />
                                                </div>
                                            </div>
                                            {/* Language */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Language</label>
                                                <select className="w-full rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option>English</option>
                                                    <option>French</option>
                                                    <option>Spanish</option>
                                                </select>
                                            </div>
                                            {/* Categories */}
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Categories</label>
                                                <span className="block text-xs text-gray-400 mb-1">Select categories to help people discover your publication.</span>
                                                <select className="w-full rounded-md border border-gray-700 bg-[#181818] text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option>Select a primary category</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                {selectedSettingsOption === "Payments" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        {/* Payments Section */}
                                        <div className="border-b border-gray-700 pb-8 mb-8">
                                            <h2 className="text-2xl font-bold mb-4">Payments</h2>
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div>
                                                    <div className="font-semibold mb-1">Connect Stripe</div>
                                                    <div className="text-sm text-muted-foreground mb-1">Takes about 5 minutes. This is how money from subscribers gets to your bank account. Stripe may display your business phone number and address on subscriber invoices unless hidden. <a href="#" className="underline">Learn more</a></div>
                                                </div>
                                                <button type="button" className="bg-[#635bff] hover:bg-[#5546d6] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Connect with <span className="font-bold">stripe</span></button>
                                            </div>
                                        </div>

                                        {/* Pledges Section */}
                                        <div>
                                            <h2 className="text-2xl font-bold mb-4">Pledges</h2>
                                            {/* Allow readers to pledge subscriptions */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <div className="font-semibold">Allow readers to pledge subscriptions</div>
                                                    <div className="text-sm text-muted-foreground max-w-lg">{`When turned on, readers of Amahle's Substack will be able to pledge to pay for a future paid subscription to Amahle's Substack`}</div>
                                                </div>
                                                {/* Toggle Switch (placeholder) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                    <span className="sr-only">Enable pledges</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>

                                            {/* Monthly pledge amount */}
                                            <div className="mt-6">
                                                <div className="font-semibold">Monthly pledge amount</div>
                                                <div className="text-sm text-muted-foreground mb-2">The amount pledged subscribers are asked to pay per month.</div>
                                                <div className="flex gap-2 max-w-xs">
                                                    <input type="number" defaultValue="8.00" step="0.01" className="w-24 rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                    <select className="rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option>USD</option>
                                                        <option>EUR</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {/* Annual pledge amount */}
                                            <div className="mt-6">
                                                <div className="font-semibold">Annual pledge amount</div>
                                                <div className="text-sm text-muted-foreground mb-2">The amount pledged subscribers are asked to pay per year.</div>
                                                <div className="flex gap-2 max-w-xs">
                                                    <input type="number" defaultValue="80.00" step="0.01" className="w-24 rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                    <select className="rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option>USD</option>
                                                        <option>EUR</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {/* Founding pledge amount */}
                                            <div className="mt-6">
                                                <div className="font-semibold">Founding pledge amount</div>
                                                <div className="text-sm text-muted-foreground mb-2">The amount pledged founding members are asked to pay per year.</div>
                                                <div className="flex gap-2 max-w-xs">
                                                    <input type="number" defaultValue="150.00" step="0.01" className="w-24 rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                    <select className="rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                        <option>USD</option>
                                                        <option>EUR</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Growth features" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        {/* QR Code Section */}
                                        <div className="flex items-center justify-between bg-[#232323] rounded-lg p-6 mb-8">
                                            <div>
                                                <div className="font-semibold text-lg mb-1">QR Code</div>
                                                <div className="text-sm text-muted-foreground">Use this QR code to share your publication.</div>
                                            </div>
                                            <div className="w-24 h-24 flex items-center justify-center bg-[#181818] rounded-lg">
                                                {/* Replace src with your QR code image or generator */}
                                                <img src="/somaweb/public/qr-demo.png" alt="QR Code" className="w-24 h-24 object-contain" />
                                            </div>
                                        </div>

                                        {/* Subscriber Referrals */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <div className="font-semibold">Setup subscriber referrals</div>
                                                <div className="text-sm text-muted-foreground">Reward subscribers for sharing your Substack with others. <a href="#" className="underline">Learn more</a></div>
                                            </div>
                                            <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Setup</button>
                                        </div>

                                        {/* Toggles */}
                                        <div className="space-y-6 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Enable subscribe prompts on post page</div>
                                                    <div className="text-sm text-muted-foreground">Adds modals, pop-ups, and other prompts to encourage people to subscribe.</div>
                                                </div>
                                                {/* Toggle (placeholder, on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                    <span className="sr-only">Enable subscribe prompts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Enable auto-clips in feed</div>
                                                    <div className="text-sm text-muted-foreground">Substack will automatically feature clips from your latest video posts on Notes</div>
                                                </div>
                                                {/* Toggle (placeholder, on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                    <span className="sr-only">Enable auto-clips</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Embeddable subscribe button */}
                                        <div>
                                            <div className="font-semibold mb-1">Embeddable subscribe button</div>
                                            <div className="text-sm text-muted-foreground mb-2">Add the following HTML to any website to show a subscribe button for this publication.</div>
                                            <div className="bg-[#181818] rounded-lg p-4 flex items-center gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="flex-1 bg-transparent text-white font-mono text-xs outline-none border-none"
                                                />
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-4 py-1.5 rounded-lg text-sm">Copy</button>
                                            </div>
                                            <label className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" checked readOnly className="accent-blue-600" />
                                                Show logo in embed
                                            </label>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Emails" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        {/* Emails Section */}
                                        <div>
                                            <h2 className="text-2xl font-bold mb-6">Emails</h2>
                                            {/* Email sender name */}
                                            <div className="mb-6">
                                                <div className="font-semibold mb-1">Email sender name</div>
                                                <div className="text-sm text-muted-foreground mb-2">{`The name that appears in the "from" field of your emails.`}</div>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                                    value="Amahle from Amahle's Substack"
                                                    readOnly
                                                />
                                            </div>
                                            {/* Email header & footer */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Email header & footer</div>
                                                    <div className="text-sm text-muted-foreground">Add content to the top and bottom of every emailed post.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Edit</button>
                                            </div>
                                            {/* Email opt-out page */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Email opt-out page</div>
                                                    <div className="text-sm text-muted-foreground">The page people see after they opt out of receiving emails.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Edit</button>
                                            </div>
                                            {/* Require email address confirmation */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Require email address confirmation</div>
                                                    <div className="text-sm text-muted-foreground">Force people who sign up using only their email to confirm it before subscribing.</div>
                                                </div>
                                                {/* Toggle (placeholder, off) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition focus:outline-none">
                                                    <span className="sr-only">Require email confirmation</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                                </button>
                                            </div>
                                        </div>
                                        <hr className="border-gray-700 my-8" />
                                        {/* Welcome emails Section */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-6">Welcome emails</h3>
                                            {/* Welcome email to new subscribers */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Welcome email to new subscribers</div>
                                                    <div className="text-sm text-muted-foreground">Email sent to readers immediately after they subscribe.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Edit</button>
                                            </div>
                                            {/* Welcome email to imported subscribers */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Welcome email to imported subscribers</div>
                                                    <div className="text-sm text-muted-foreground">Email sent to readers immediately after they are imported to your publication.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Edit</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Community" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        {/* Community Section */}
                                        <div>
                                            <h2 className="text-2xl font-bold mb-6">Community</h2>
                                            {/* Enable comments, likes, and restacks */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Enable comments, likes, and restacks</div>
                                                    <div className="text-sm text-muted-foreground">Give readers the ability to like, comment on, and restack your posts.</div>
                                                </div>
                                                {/* Toggle (placeholder, on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                    <span className="sr-only">Enable comments, likes, and restacks</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Enable reporting */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Enable reporting</div>
                                                    <div className="text-sm text-muted-foreground">Allow readers to report content to you or other admins.</div>
                                                </div>
                                                {/* Toggle (placeholder, on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                    <span className="sr-only">Enable reporting</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Manage user bans */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Manage user bans</div>
                                                    <div className="text-sm text-muted-foreground">Review users banned from commenting or subscribing.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Manage bans</button>
                                            </div>
                                            {/* Moderate reported content */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Moderate reported content</div>
                                                    <div className="text-sm text-muted-foreground">Review comments and chat messages reported by your community.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Moderate</button>
                                            </div>
                                            {/* Default comment order */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Default comment order</div>
                                                    <div className="text-sm text-muted-foreground">Controls how comments on your posts will be sorted by default.</div>
                                                </div>
                                                <select className="rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option>Top first</option>
                                                    <option>Newest first</option>
                                                </select>
                                            </div>
                                            {/* Show restacks below posts */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Show restacks below posts</div>
                                                    <div className="text-sm text-muted-foreground">Displays restacks in the comments section below your posts. <a href="#" className="underline">Learn more.</a></div>
                                                </div>
                                                {/* Toggle (placeholder, on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                    <span className="sr-only">Show restacks below posts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Who can reply to your emails? */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold">Who can reply to your emails?</div>
                                                    <div className="text-sm text-muted-foreground">{`Substack will only allow email replies and direct emails to amahlebana@substack.com from the audience you select. "Verified subscribers" are users whose behavior suggests they are real people rather than bots.`}</div>
                                                </div>
                                                <select className="rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option>Subscribers</option>
                                                    <option>Verified subscribers</option>
                                                    <option>Anyone</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Chat" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Chat</h2>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Enable subscriber chat</div>
                                                <div className="text-sm text-muted-foreground">Create a space for you and your subscribers to hang out.</div>
                                            </div>
                                            {/* Toggle (placeholder, off) */}
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition focus:outline-none">
                                                <span className="sr-only">Enable subscriber chat</span>
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Team" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Team</h2>
                                        {/* Publication team */}
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <div className="font-semibold">Publication team</div>
                                                <div className="text-sm text-muted-foreground">Add others to help manage your publication.</div>
                                            </div>
                                            <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Invite</button>
                                        </div>
                                        {/* Team Table */}
                                        <div className="bg-[#232323] rounded-lg p-4 mb-8">
                                            <div className="flex font-semibold text-muted-foreground border-b border-gray-700 pb-2 mb-2">
                                                <div className="w-1/3">Name</div>
                                                <div className="w-1/3">Visibility</div>
                                                <div className="w-1/3">Role</div>
                                            </div>
                                            <div className="flex items-center py-2">
                                                <div className="w-1/3">Amahle</div>
                                                <div className="w-1/3"><span className="bg-[#181818] px-3 py-1 rounded-md text-white">Public</span></div>
                                                <div className="w-1/3"><span className="bg-[#181818] px-3 py-1 rounded-md text-white">Owner</span></div>
                                            </div>
                                        </div>
                                        {/* Definitions */}
                                        <div>
                                            <div className="font-semibold mb-2">Definitions</div>
                                            <div className="bg-[#232323] rounded-lg p-4 text-sm text-muted-foreground space-y-2">
                                                <div><span className="font-bold text-white">Admin:</span> Full publication access, including all settings</div>
                                                <div><span className="font-bold text-white">Contributor:</span> Can publish and edit posts, but can not access settings</div>
                                                <div><span className="font-bold text-white">Byline:</span> Can be listed as the author of posts, but can not publish or access settings</div>
                                                <hr className="border-gray-700 my-2" />
                                                <div><span className="font-bold text-white">Public:</span> Publicly listed as a team member</div>
                                                <div><span className="font-bold text-white">Private:</span> Not publicly listed as a team member</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Privacy" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Privacy</h2>
                                        {/* Private mode */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Private mode</div>
                                                <div className="text-sm text-muted-foreground">In private mode, only people you approve can subscribe and view your posts. Existing subscribers will not be affected.</div>
                                            </div>
                                            {/* Toggle (placeholder, off) */}
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition focus:outline-none">
                                                <span className="sr-only">Private mode</span>
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                            </button>
                                        </div>
                                        {/* Allow cross-posting */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Allow cross-posting</div>
                                                <div className="text-sm text-muted-foreground">Allow free posts to be cross-posted to other publications. Cross-posting can help expose your publication get discovered by new audiences.</div>
                                            </div>
                                            {/* Toggle (placeholder, on) */}
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                <span className="sr-only">Allow cross-posting</span>
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                            </button>
                                        </div>
                                        {/* Allow listing on Substack.com */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Allow listing on Substack.com</div>
                                                <div className="text-sm text-muted-foreground">Allow visitors to the Substack website to search for and discover your publication</div>
                                            </div>
                                            {/* Toggle (placeholder, on) */}
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                <span className="sr-only">Allow listing on Substack.com</span>
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                            </button>
                                        </div>
                                        {/* Block AI training */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Block AI training</div>
                                                <div className="text-sm text-muted-foreground">Tells third-party AI-tools like ChatGPT and Google Gemini that their models should not be trained on your content. Note this may limit your discoverability on these platforms.</div>
                                            </div>
                                            {/* Toggle (placeholder, off) */}
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition focus:outline-none">
                                                <span className="sr-only">Block AI training</span>
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                            </button>
                                        </div>
                                        {/* Show approximate subscriber count */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Show approximate subscriber count</div>
                                                <div className="text-sm text-muted-foreground">Displays your rough subscriber count in places like your profile and welcome page. This can help boost free subscriber conversion.</div>
                                            </div>
                                            {/* Toggle (placeholder, on) */}
                                            <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition focus:outline-none">
                                                <span className="sr-only">Show approximate subscriber count</span>
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                            </button>
                                        </div>
                                        {/* Custom terms of service */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Custom terms of service</div>
                                                <div className="text-sm text-muted-foreground">Add your own terms of service to your publication.</div>
                                            </div>
                                            <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Customize</button>
                                        </div>
                                        {/* Custom privacy policy */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Custom privacy policy</div>
                                                <div className="text-sm text-muted-foreground">Add your own privacy policy to your publication.</div>
                                            </div>
                                            <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Customize</button>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Notifications" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                                        {/* Notification Toggles */}
                                        <div className="space-y-4">
                                            {/* New pledged subscription */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">New pledged subscription</div>
                                                    <div className="text-sm text-muted-foreground">When someone pledges a paid subscription to your Substack</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">New pledged subscription</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* New free subscriber */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">New free subscriber</div>
                                                    <div className="text-sm text-muted-foreground">When someone subscribes to your Substack for free</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">New free subscriber</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Canceled free subscription */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Canceled free subscription</div>
                                                    <div className="text-sm text-muted-foreground">When someone cancels their free subscription</div>
                                                </div>
                                                {/* Toggle (off) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition focus:outline-none">
                                                    <span className="sr-only">Canceled free subscription</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                                </button>
                                            </div>
                                            <hr className="border-gray-700 my-4" />
                                            {/* Likes on your posts */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Likes on your posts</div>
                                                    <div className="text-sm text-muted-foreground">When someone likes a post you published</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Likes on your posts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Comments on your posts */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Comments on your posts</div>
                                                    <div className="text-sm text-muted-foreground">When someone comments on a post you published. <a href="#" className="underline">Manage replies here</a></div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Comments on your posts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Links to your posts */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Links to your posts</div>
                                                    <div className="text-sm text-muted-foreground">When someone links to your Substack or a post you published</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Links to your posts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Cross-posts of your posts */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Cross-posts of your posts</div>
                                                    <div className="text-sm text-muted-foreground">When someone cross-posts a post you published</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Cross-posts of your posts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            <hr className="border-gray-700 my-4" />
                                            {/* Shareable assets for your posts */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Shareable assets for your posts</div>
                                                    <div className="text-sm text-muted-foreground">Delivers images and video assets for each post you publish</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Shareable assets for your posts</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Post stats digests */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Post stats digests</div>
                                                    <div className="text-sm text-muted-foreground">Summarizes the performance of each post after 24h</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Post stats digests</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Substack stats digests */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Substack stats digests</div>
                                                    <div className="text-sm text-muted-foreground">Summarizes the performance of your Substack each month</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Substack stats digests</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            <hr className="border-gray-700 my-4" />
                                            {/* New milestones */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">New milestones</div>
                                                    <div className="text-sm text-muted-foreground">Tells you when you hit a major growth milestone.</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">New milestones</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Unfinished draft reminders */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Unfinished draft reminders</div>
                                                    <div className="text-sm text-muted-foreground">Tells you when you start a draft but may have forgotten to publish.</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Unfinished draft reminders</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            {/* Getting started tips */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Getting started tips</div>
                                                    <div className="text-sm text-muted-foreground">Suggests ways to finish setting up your Substack.</div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">Getting started tips</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                            <hr className="border-gray-700 my-4" />
                                            {/* User reports */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">User reports</div>
                                                    <div className="text-sm text-muted-foreground">When someone reports problematic content to you. <a href="#" className="underline">Manage reports here</a></div>
                                                </div>
                                                {/* Toggle (on) */}
                                                <button type="button" className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition focus:outline-none">
                                                    <span className="sr-only">User reports</span>
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Connected accounts" && (
                                    <div>
                                        <div>
                                            <h3 className="text-2xl font-semibold text-gray-900">Social Media Links</h3>
                                            <span className="text-xs text-gray-400">Connect your other accounts to let people know where to find you.</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="user_facebook" className="flex items-center gap-2">
                                                    <IconBrandFacebook className="h-4 w-4" />
                                                    Facebook
                                                </Label>
                                                <Input
                                                    id="user_facebook"
                                                    type="url"

                                                    placeholder="https://facebook.com/yourprofile"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_instagram" className="flex items-center gap-2">
                                                    <IconBrandInstagram className="h-4 w-4" />
                                                    Instagram
                                                </Label>
                                                <Input
                                                    id="user_instagram"
                                                    type="text"

                                                    placeholder="@yourusername"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_x_twitter" className="flex items-center gap-2">
                                                    <IconBrandX className="h-4 w-4" />
                                                    X (Twitter)
                                                </Label>
                                                <Input
                                                    id="user_x_twitter"
                                                    type="text"

                                                    placeholder="@yourusername"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_threads" className="flex items-center gap-2">
                                                    <IconBrandThreads className="h-4 w-4" />
                                                    Threads
                                                </Label>
                                                <Input
                                                    id="user_threads"
                                                    type="text"

                                                    placeholder="@yourusername"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_youtube" className="flex items-center gap-2">
                                                    <IconBrandYoutube className="h-4 w-4" />
                                                    YouTube
                                                </Label>
                                                <Input
                                                    id="user_youtube"
                                                    type="url"

                                                    placeholder="https://youtube.com/@yourchannel"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_linkedin" className="flex items-center gap-2">
                                                    <IconBrandLinkedin className="h-4 w-4" />
                                                    LinkedIn
                                                </Label>
                                                <Input
                                                    id="user_linkedin"
                                                    type="url"
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_tiktok" className="flex items-center gap-2">
                                                    <IconBrandTiktok className="h-4 w-4" />
                                                    TikTok
                                                </Label>
                                                <Input
                                                    id="user_tiktok"
                                                    type="text"
                                                    placeholder="@yourusername"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_website" className="flex items-center gap-2">
                                                    <IconWorld className="h-4 w-4" />
                                                    Personal Website
                                                </Label>
                                                <Input
                                                    id="user_website"
                                                    type="url"
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_book_name" className="flex items-center gap-2">
                                                    <IconBook className="h-4 w-4" />
                                                    Book Name
                                                </Label>
                                                <Input
                                                    id="user_book_name"
                                                    type="text"
                                                    placeholder="Enter your book name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="user_book_website" className="flex items-center gap-2">
                                                    <IconBookmark className="h-4 w-4" />
                                                    Book Website
                                                </Label>
                                                <Input
                                                    id="user_book_website"
                                                    type="url"
                                                    placeholder="https://yourbookwebsite.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Domain" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Domain</h2>
                                        {/* Add a custom domain */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Add a custom domain</div>
                                                <div className="text-sm text-muted-foreground">Set up your Substack to live on a domain you already own.</div>
                                            </div>
                                            <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Add</button>
                                        </div>
                                        {/* Use your domain on Bluesky */}
                                        <div className="mb-4">
                                            <div className="font-semibold">Use your domain on Bluesky</div>
                                            <div className="text-sm text-muted-foreground">To claim <a href="https://amahlebana.substack.com" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">@amahlebana.substack.com</a>{` as your handle on Bluesky, tap "Copy domain value" in the "Change my handle" section of the Bluesky settings, then paste it into the box below. `}<a href="#" className="underline">Learn more</a></div>
                                        </div>
                                        <div className="flex items-center gap-4 bg-[#232323] rounded-lg p-4">
                                            <input
                                                type="text"
                                                className="flex-1 rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value="8.00"
                                                readOnly
                                            />
                                            <button type="button" className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Submit</button>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Analytics" && (
                                    <div>Analytics (Coming Soon)</div>
                                )}
                                {selectedSettingsOption === "Details" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Details</h2>
                                        {/* Copyright owner */}
                                        <div className="mb-4">
                                            <div className="font-semibold">Copyright owner</div>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                                                value="Amahle"
                                                readOnly
                                            />
                                            <div className="text-sm text-muted-foreground">Name for copyright notices</div>
                                        </div>
                                        {/* Mailing address */}
                                        <div className="mb-4">
                                            <div className="font-semibold">Mailing address</div>
                                            <textarea
                                                className="w-full rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1 min-h-[60px]"
                                                value={"548 Market Street PMB 72296\nSan Francisco, CA 94104"}
                                                readOnly
                                            />
                                            <div className="text-sm text-muted-foreground">Business address to show at the bottom of all emails. Can be a PO Box</div>
                                        </div>
                                        {/* Email address for RSS feeds */}
                                        <div className="mb-4">
                                            <div className="font-semibold">Email address for RSS feeds</div>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-gray-700 bg-background text-primary px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
                                                value="amahlebana@substack.com"
                                                readOnly
                                            />
                                            <div className="text-sm text-muted-foreground">{`The email displayed on your RSS feeds. By default, we'll use your publication's Substack email (amahlebana@substack.com). Any email sent to this address is forwarded to the publication owner based on the "receive email replies from" setting above.`}</div>
                                        </div>
                                        {/* Publication introduction */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="font-semibold">Publication introduction</div>
                                                <div className="text-sm text-muted-foreground">Add 2-3 sentences to introduce your publication to new readers on discovery surfaces.</div>
                                            </div>
                                            <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Edit</button>
                                        </div>
                                    </div>
                                )}
                                {selectedSettingsOption === "Import / Export" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8">
                                        <h2 className="text-2xl font-bold mb-6">Import / Export</h2>
                                        <div className="bg-[#232323] rounded-lg p-6 space-y-6">
                                            {/* Import email addresses */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Import email addresses</div>
                                                    <div className="text-sm text-muted-foreground">Bring over your existing subscribers by copy pasting their addresses or uploading a CSV file.</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Import emails</button>
                                            </div>
                                            {/* Import posts */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Import posts</div>
                                                    <div className="text-sm text-muted-foreground">Bring your archives from your blog, Medium, Beehiv, Ghost, Mailchimp, WordPress, TinyLetter, Tumblr, Webflow, or website with an RSS feed</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Import posts</button>
                                            </div>
                                            {/* Export your data */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Export your data</div>
                                                    <div className="text-sm text-muted-foreground">{`Export your posts, subscriber list, and related data. We'll send you an email when your export is ready to download.`}</div>
                                                </div>
                                                <button type="button" className="bg-[#444] hover:bg-[#333] text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">New export</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedSettingsOption === "Danger Zone" && (
                                    <div className="max-w-2xl mx-auto bg-background rounded-xl shadow-lg p-8 text-primary space-y-8 border border-red-500">
                                        <h2 className="text-2xl font-bold mb-6 text-red-500">Danger Zone</h2>
                                        <div className="space-y-6">
                                            {/* Delete post archive */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Delete post archive</div>
                                                    <div className="text-sm text-muted-foreground">Permanently delete all posts on this publication.</div>
                                                </div>
                                                <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Delete archive</button>
                                            </div>
                                            {/* Change publication subdomain */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Change publication subdomain</div>
                                                    <div className="text-sm text-muted-foreground">Permanently change your URL (amahlebana.substack.com).</div>
                                                </div>
                                                <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Change subdomain</button>
                                            </div>
                                            {/* Delete publication */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold">Delete publication</div>
                                                    <div className="text-sm text-muted-foreground">Permanently delete your publication, posts, subscriber list, and all other content. Once you do this, there is no going back.</div>
                                                </div>
                                                <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg text-base shadow-md transition">Delete publication</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>
                    )
                    }
                </section >

                {/* Right Section - 30% */}
                < section className="border border-red-500 hidden xl:block w-[28%] bg-muted p-4 fixed right-4 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" >


                </section >
            </main >

            {/* Search Query Modal */}
            < SearchQueryDialog
                searchQueryModal={searchQueryModal}
                setSearchQueryModal={setSearchQueryModal}
                activeSearchCategory={activeSearchCategory}
                setActiveSearchCategory={setActiveSearchCategory}
                searchCategories={searchCategories}
            />

            {/* Notifications Modal */}
            < NotificationsDialog
                notificationsModal={notificationsModal}
                setNotificationsModal={setNotificationsModal}
                activeNotificationCategory={activeNotificationCategory}
                setActiveNotificationCategory={setActiveNotificationCategory}
                notificationCategories={notificationCategories}
            />

        </div >

    )
}
