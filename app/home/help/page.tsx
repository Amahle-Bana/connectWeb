"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Book, Mic, Moon, Newspaper, Plus, Users, FileText } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Bell, Mail, Sun, Info, LayoutDashboard, ChevronLeftIcon, UserCircleIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Dialog4, DialogContent4, DialogHeader4, DialogTitle4 } from "@/components/DiscoveryPage/dialog4";
import useWindowSize from "@/hooks/useWindow";
import { useAuth } from '@/context/auth-context';
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { NotificationsDialog } from "@/components/DiscoveryPage/NotificationsDialog";
import { SearchDialog } from "@/components/DiscoveryPage/SearchDialog";



// Define the categories type
type Categories = {
    [key: string]: string[];
};

// Add the categories data
const categories: Categories = {
    "Family": ["Adoption", "Children", "Elder Care", "Fatherhood", "Motherhood", "Parenting", "Pregnancy", "Seniors"],
    "Health": ["Aging", "Coronavirus", "Covid-19", "Death And Dying", "Disease", "Fitness", "Healthcare", "Mental Health", "Nutrition", "Sleep", "Trans Healthcare", "Vaccines", "Weight Loss", "Womens Health"],
    "Relationships": ["Dating", "Divorce", "Friendship", "Love", "Marriage", "Polymary"],
    "Sexuality": ["BDSM", "Erotica", "Kink", "Sex", "Sexual Health"],
    "Home": ["Architecture", "Home Improvement", "Homeownership", "Interior Design", "Rental Property", "Vacation Rental"],
    "Food": ["Cooking", "Desserts", "Drinks", "Gluten-Free", "Healthy", "Meat", "Pasta", "Pizza", "Salad", "Sandwiches", "Seafood", "Sides", "Soups", "Vegan", "Vegetarian"],
    "Pets": ["Cats", "Dogs", "Fish", "Horses", "Other Pets", "Reptiles", "Small Pets", "Wildlife"],
    "Mental Health": ["Anxiety", "Couseling", "Grief", "Life Lessons", "Self-Awareness", "Bipolar", "Depression", "Eating Disorders", "Grief", "LGBTQ+", "Mental Health", "PTSD", "Self-Help", "Stress", "Suicide", "Trauma"],
    "Productivity": ["Career Advice", "Coaching", "Goal Setting", "Morning Routines", "Pomodoro Technique", "Time Management", "To-Do Lists", "Workflow", "Time Management", "Work Life Balance"],
    "Mindfulness": ["Mediation", "Journaling", "Mediation", "Transcendental Mediation", "Yoga"],
    "Business": ["Business", "Freelancing", "Small Business", "Startups", "Venture Capital"],
    "Marketing": ["Advertising", "Branding", "Content Marketing", "Content Strategy", "Digital Marketing", "SEO", "Social Media", "Storytelling For Business"],
    "Leadership": ["Employee Engagement", "Leadership Development", "Management", "Meetings", "Org Charts", "Thought Leadership"],
    "Work": ["Company Retreats", "Digital Nomads", "Distributed Teams", "Future Of Work", "Work From Home", "Remote Work"],
    "Artificial Intelligence": ["ChatGPT", "Conversational AI", "Deep Learning", "Large Language Models", "Machine Learning", "NLP", "Voice Assistants"],
    "Blockchain": ["Bitcoin", "Decentralized Finance", "Cryptocurrency", "Ethereum", "NFTs", "Smart Contracts", "Web3"],
    "Data Science": ["Data Analysis", "Data Visualization", "Data Engineering", "Data Mining", "Data Modeling", "Database Design", "Tools", "Libraries", "Frameworks", "Projects", "Tutorials", "SQL"],
    "Gadgets": ["eBook", "Internet Of Things", "Tablets", "Smart Home", "Smartphones", "Wearables", "Laptops", "Computers", "VR Glasses", "AR Glasses", "TVs"],
    "Makers": ["3D Printing", "Arduino", "DIY", "Raspberry Pi", "Robotics"],
    "Security": ["Cybersecurity", "Data Security", "Encryption", "Infosec", "Passwords", "Privacy"],
    "Technology": ["Amazon", "Apple", "Google", "Mastodon", "Medium", "Meta", "Microsoft", "Tiktok", "Twitter"],
    "Design": ["Accessibility", "Designs Systems", "Design Thinking", "Graphic Design", "Icon Design", "Inclusive Design", "Product Design", "Typography", "UX Design", "UI Design"],
    "Project Management": ["Agile", "Kanban", "Scrum", "Waterfall", "Innovation", "Kanban", "Lean Startup", "MVP", "Product", "Strategy", "Project Planning", "Project Execution", "Project Monitoring", "Project Evaluation", "Project Closure"],
    "Programming": ["Android Development", "Coding", "Flutter", "Frontend Engineering", "iOS Development", "Mobile Development", "Software Engineering", "Web Development", "Angular", "CSS", "HTML", "JavaScript", "Python", "React", "React Native", "Ruby", "Rust", "Swift", "TypeScript", "Vue", "Webpack", "WordPress", "Xamarin", "Yarn", "Zapier"],
    "Dev Ops": ["AWS", "Databricks", "Docker", "Kubernetes", "Terraform"],
    "Operating Systems": ["Android", "iOS", "Linux", "MacOS", "Windows"],
    "Writing": ["30 Day Challenge", "Book Reviews", "Books", "Creative Nonfiction", "Diary", "Fiction", "Haiku", "Hello World", "Memior", "Nonfiction", "Personal Essay", "Poetry", "Screenwriting", "Short Stories", "This Happened", "Writing Prompts", "Writing Tips"],
    "Art": ["Comics", "Contemporary Art", "Drawing", "Fine Art", "Graphic Design", "Illustration", "Painting", "Photography", "Sculpture", "Typography", "Generative Art", "Illustration", "Painting", "Portraits", "Street Art"],
    "Game Design": ["Game Design", "Game Development", "Indie Game", "Metaverse", "Nintendo", "Playstation", "Videogames", "Virtual Reality", "Xbox"],
    "Philosophy": ["Atheism", "Epistemology", "Ethics", "Existentialism", "Feminism", "Freud", "Gandhi", "Hegel", "Hume", "Kant", "Marx", "Nietzsche", "Plato", "Postmodernism", "Psychoanalysis", "Religion", "Socrates", "Stoicism", "Wittgenstein"],
    "Religion": ["Buddhism", "Christianity", "Hinduism", "Islam", "Judaism", "Latter-Day Saints", "Mormonism", "Orthodox Christianity", "Protestantism", "Sikhism", "Spirituality", "Zoroastrianism"],
    "Spirituality": ["Astrology", "Energy Healing", "Horoscopes", "Mysticism", "New Age", "Occult", "Parapsychology", "Psychology", "Reiki", "Tarot", "Voodoo"],
    "Cultural Studies": ["Ancient History", "Anthropology", "Cultural Heritage", "Digital Life", "History", "Museums", "Sociology", "Tradition"],
    "Fashion": ["Accessories", "Clothing", "Design", "Jewelry", "Shoes", "Style", "Trends", "Luxury Fashion"],
    "Language": ["Chinese", "English", "French", "German", "Italian", "Japanese", "Korean", "Portuguese", "Russian", "Spanish", "Turkish", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch", "Polish", "Portuguese", "Romanian", "Serbian", "Slovak", "Slovenian", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch"],
    "Sports": ["Football(soccer)", "Gridiron Football", "Hockey", "Rugby", "Tennis", "Basketball", "Baseball", "Cricket", "Golf", "Soccer", "Volleyball", "Water Polo", "Wrestling", "Boxing", "MMA", "Mixed Martial Arts", "Wrestling", "Boxing", "MMA"],
    "Cities": ["Amsterdam", "Athens", "Berlin", "Buenos Aires", "Cairo", "Cape Town", "Dubai", "Edinburgh", "Florence", "Geneva", "Hong Kong", "Istanbul", "Jerusalem", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Madrid", "Melbourne", "Mexico City", "Milan", "Montreal", "Moscow", "Munich", "New York", "Oslo", "Paris", "Prague", "Rome", "San Francisco", "Sao Paulo", "Seoul", "Shanghai", "Singapore", "Stockholm", "Sydney", "Tokyo", "Toronto", "Vienna", "Warsaw", "Wellington", "Zurich"],
    "Beauty": ["Beauty", "Tips", "Products", "News", "Reviews", "Tutorials", "How-To", "Tips", "Products", "Trends", "News", "Reviews", "Tutorials", "How-To"],
    "Nature": ["Birding", "Camping", "Climate Change", "Conservation", "Ecology", "Environment", "Extinction", "Global Warming", "Green Living", "Pollution", "Recycling", "Sustainability", "Wildlife", "Hiking"],
    "Travel": ["Tourism", "Travel Tips", "Travel Writing", "Vacation", "Vanlife"]
};

const creators = [
    { id: 1, name: "John Doe", followers: "10K", category: "Photography" },
    { id: 2, name: "Jane Smith", followers: "15K", category: "Art" },
    { id: 3, name: "Mike Johnson", followers: "8K", category: "Design" },
];

const publications = [
    { id: 1, title: "Digital Trends", category: "Technology" },
    { id: 2, title: "Creative Review", category: "Design" },
    { id: 3, title: "Art & Culture", category: "Arts" },
];

const magazines = [
    { id: 1, title: "Vogue", category: "Fashion" },
    { id: 2, title: "National Geographic", category: "Science" },
    { id: 3, title: "Time", category: "News" },
];

const podcasts = [
    { id: 1, title: "Tech Talk", host: "Sarah Wilson" },
    { id: 2, title: "Design Matters", host: "David Chen" },
    { id: 3, title: "Art Stories", host: "Emma Brown" },
];

const searchCategories = ["Creators", "Publications", "Magazines", "Podcasts"];

const notificationCategories = ["All", "Notifications", "Messages", "Requests", "Comments", "Likes"];

export default function HelpPage() {

    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("creators");

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    // Search Categories Scroll Ref
    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    // Expanded Categories
    const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

    // Theme
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // useWindowSize
    const { width } = useWindowSize();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();
    const currentUser = useAppSelector((state) => state.user);

    // Router
    const router = useRouter();

    // Mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-muted font-playfair-display">


            {/* Header */}
            <header className="border-b bg-white fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    <div className="flex items-center gap-4">
                        {/* Left - Back Button */}
                        <ChevronLeftIcon className="h-6 w-6 text-primary cursor-pointer" onClick={() => router.back()} />

                    {/* Left - SOMA (Company Logo) */}
                    {typeof window !== 'undefined' && window.innerWidth >= 768 ?
                        <div className="text-3xl font-semibold text-secondary">Help</div>
                        :
                            <UserCircleIcon className="h-6 w-6 text-primary" />
                        }
                    </div>

                    {/* Middle - Search Bar */}
                    {typeof window !== 'undefined' && window.innerWidth >= 550 ? (
                        <div className="flex-1 max-w-xl mx-2 bg-background">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full placeholder:hidden md:placeholder:block"
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
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

                        {/* Dashboard/Login Button */}
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                {typeof window !== 'undefined' && width < 768 ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-gray-200 rounded-sm"
                                    >
                                        <LayoutDashboard className="h-6 w-6" />
                                    </Button>
                                ) : (
                                    <Button
                                        className={`bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-sm`}
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
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm"
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
                                    className="h-8 w-8 hover:bg-gray-200 rounded-sm"
                                >
                                    <Mail className="h-6 w-6" />
                                </Button>
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        {mounted && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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


            <div className="container mx-auto p-6 mt-16">
                {/* Search Bar */}
                <div className="flex gap-6">
                    {/* Left Section - 100% */}
                    <div className="w-full flex flex-col items-center justify-center">

                        {/* Title and Description */}
                        <div className="mb-6 flex flex-col items-center justify-center gap-2">
                            <h1 className="text-3xl font-bold mb-2">Help</h1>
                            <p className="text-primary text-center">
                                How Can We Help You?
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative mb-10 w-[100%] md:w-[80%] lg:w-[70%] xl:w-[60%]">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                className="p-6 pl-10 w-full text-lg placeholder:hidden md:placeholder:block placeholder:text-lg rounded-2xl bg-background"
                            // onClick={() => setSearchQueryModal(true)}
                            />
                        </div>

                        <Tabs defaultValue="articles" className="w-full">
                            {!isAuthenticated ? (
                                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 mt-6">
                                    <h3 className="text-xl font-semibold text-center">Please Login to View Help Page</h3>
                                    <p className="text-sm text-gray-600 text-center">
                                        Create An Account Or Login To Get Help With Your Account, Privacy, Notifications, and More.
                                    </p>
                                    <Link href="/login" className="w-full flex justify-center">
                                        <Button 
                                            className="w-[160px] bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                                        >
                                            Login to Continue
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <TabsList className="w-full h-10 md:h-10 overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-background flex flex-wrap md:flex-nowrap gap-1 p-1">
                                        <TabsTrigger
                                            value="articles"
                                            className="cursor-pointer px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap min-w-fit data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50 rounded-sm"
                                        >
                                            <FileText className="w-4 h-4" />
                                            {width < 600 ? "" : "Articles"}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="magazines"
                                            className="cursor-pointer px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap min-w-fit data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50 rounded-sm"
                                        >
                                            <Book className="w-4 h-4" />
                                            {width < 600 ? "" : "Magazines"}
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="podcasts"
                                            className="cursor-pointer px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base whitespace-nowrap min-w-fit data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50 rounded-sm"
                                        >
                                            <Mic className="w-4 h-4" />
                                            {width < 600 ? "" : "Podcasts"}
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="articles" className="mt-6">
                                        
                                        {/* Recommended Articles */}
                                        <div className="p-5 flex flex-col items-center justify-center">
                                            <p className="text-lg text-gray-500 font-semibold mb-4">Recommended Articles Categories:</p>
                                            <p className="text-primary text-center">Article 1, Article 2, Article 3, Article 4, Article 5</p>
                                            <p className={`text-green-500 flex flex-row items-center justify-center gap-2 ${width < 600 ? "text-xs" : "block"}`}>(Use <Info className="w-6 h-6" /> To Suggest New Categories To Help Us Improve)</p>
                                            <p className={`text-green-500 flex flex-row items-center justify-center gap-2 ${width < 600 ? "text-xs" : "block"}`}>(Use <Plus className="w-6 h-6" /> To Add New Categories To Your Interests)</p>
                                        </div>

                                        {/* Articles */}
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                            {Object.entries(categories).map(([category, subcategories]) => (
                                                <Card key={category} className="hover:shadow-lg transition-shadow">
                                                    <CardHeader className="border-b border-gray-200 h-[30px] flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center justify-between">
                                                            <div className="mr-2 hover:cursor-pointer hover:bg-gray-300 rounded-sm"><Info className="w-6 h-6" /></div>
                                                            <h3 className="text-lg font-semibold capitalize">{category}</h3>
                                                        </div>
                                                        <div><Plus className="w-6 h-6 hover:cursor-pointer hover:bg-gray-300 rounded-sm" /></div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            {subcategories.slice(0, expandedCategories[category] ? subcategories.length : 5).map((subcategory, index) => (
                                                                <div key={index} className="flex items-center space-x-2 flex-row items-center justify-between">
                                                                    <span className="text-sm text-gray-600 hover:text-primary cursor-pointer">{subcategory}</span>
                                                                </div>
                                                            ))}
                                                            {subcategories.length > 5 && (
                                                                <button
                                                                    onClick={() => setExpandedCategories(prev => ({
                                                                        ...prev,
                                                                        [category]: !prev[category]
                                                                    }))}
                                                                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                >
                                                                    {expandedCategories[category] ? 'Show Less' : 'Show More'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="magazines" className="mt-6">

                                        {/* Recommended Magazines */}
                                        <div className="p-5 flex flex-col items-center justify-center">
                                            <p className="text-lg text-gray-500 font-semibold mb-4">Recommended Magazines Categories:</p>
                                            <p className="text-primary text-center">Magazine 1, Magazine 2, Magazine 3, Magazine 4, Magazine 5</p>
                                            <p className={`text-green-500 flex flex-row items-center justify-center gap-2 ${width < 600 ? "text-xs" : "block"}`}>(Use <Info className="w-6 h-6" /> To Suggest New Categories To Help Us Improve)</p>
                                            <p className={`text-green-500 flex flex-row items-center justify-center gap-2 ${width < 600 ? "text-xs" : "block"}`}>(Use <Plus className="w-6 h-6" /> To Add New Categories To Your Interests)</p>
                                        </div>

                                        {/* Magazines */}
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                            {Object.entries(categories).map(([category, subcategories]) => (
                                                <Card key={category} className="hover:shadow-lg transition-shadow">
                                                    <CardHeader className="border-b border-gray-200 h-[30px] flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center justify-between">
                                                            <div className="mr-2 hover:cursor-pointer hover:bg-gray-300 rounded-sm"><Info className="w-6 h-6" /></div>
                                                            <h3 className="text-lg font-semibold capitalize">{category}</h3>
                                                        </div>
                                                        <div><Plus className="w-6 h-6 hover:cursor-pointer hover:bg-gray-300 rounded-sm" /></div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            {subcategories.slice(0, expandedCategories[category] ? subcategories.length : 5).map((subcategory, index) => (
                                                                <div key={index} className="flex items-center space-x-2 flex-row items-center justify-between">
                                                                    <span className="text-sm text-gray-600 hover:text-primary cursor-pointer">{subcategory}</span>
                                                                </div>
                                                            ))}
                                                            {subcategories.length > 5 && (
                                                                <button
                                                                    onClick={() => setExpandedCategories(prev => ({
                                                                        ...prev,
                                                                        [category]: !prev[category]
                                                                    }))}
                                                                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                >
                                                                    {expandedCategories[category] ? 'Show Less' : 'Show More'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="podcasts" className="mt-6">

                                        {/* Recommended Podcasts */}
                                        <div className="p-5 flex flex-col items-center justify-center">
                                            <p className="text-lg text-gray-500 font-semibold mb-4">Recommended Podcasts Categories:</p>
                                            <p className="text-primary text-center">Podcast 1, Podcast 2, Podcast 3, Podcast 4, Podcast 5</p>
                                            <p className={`text-green-500 flex flex-row items-center justify-center gap-2 ${width < 600 ? "text-xs" : "block"}`}>(Use <Info className="w-6 h-6" /> To Suggest New Categories To Help Us Improve)</p>
                                            <p className={`text-green-500 flex flex-row items-center justify-center gap-2 ${width < 600 ? "text-xs" : "block"}`}>(Use <Plus className="w-6 h-6" /> To Add New Categories To Your Interests)</p>
                                        </div>

                                        {/* Podcasts */}
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                            {Object.entries(categories).map(([category, subcategories]) => (
                                                <Card key={category} className="hover:shadow-lg transition-shadow">
                                                    <CardHeader className="border-b border-gray-200 h-[30px] flex flex-row items-center justify-between">
                                                        <div className="flex flex-row items-center justify-between">
                                                            <div className="mr-2 hover:cursor-pointer hover:bg-gray-300 rounded-sm"><Info className="w-6 h-6" /></div>
                                                            <h3 className="text-lg font-semibold capitalize">{category}</h3>
                                                        </div>
                                                        <div><Plus className="w-6 h-6 hover:cursor-pointer hover:bg-gray-300 rounded-sm" /></div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            {subcategories.slice(0, expandedCategories[category] ? subcategories.length : 5).map((subcategory, index) => (
                                                                <div key={index} className="flex items-center space-x-2 flex-row items-center justify-between">
                                                                    <span className="text-sm text-gray-600 hover:text-primary cursor-pointer">{subcategory}</span>
                                                                </div>
                                                            ))}
                                                            {subcategories.length > 5 && (
                                                                <button
                                                                    onClick={() => setExpandedCategories(prev => ({
                                                                        ...prev,
                                                                        [category]: !prev[category]
                                                                    }))}
                                                                    className="text-sm text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                                                >
                                                                    {expandedCategories[category] ? 'Show Less' : 'Show More'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>


            {/* Notifications Dialog */}
            <NotificationsDialog
                open={notificationsModal}
                onOpenChange={setNotificationsModal}
                isAuthenticated={isAuthenticated}
                activeNotificationCategory={activeNotificationCategory}
                setActiveNotificationCategory={setActiveNotificationCategory}
                notificationCategories={notificationCategories}
            />

            {/* Search Query Dialog */}
            <SearchDialog
                open={searchQueryModal}
                onOpenChange={setSearchQueryModal}
                isAuthenticated={isAuthenticated}
                activeSearchCategory={activeSearchCategory}
                setActiveSearchCategory={setActiveSearchCategory}
                searchCategories={searchCategories}
            />
        </div>
    );
}
