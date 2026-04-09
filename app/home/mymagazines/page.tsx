"use client"

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, ChevronLeftIcon, Compass, Mail, Moon, Sun, MoreHorizontal, Plus, UserCircleIcon, Search, LayoutDashboard } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog2, DialogContent2, DialogHeader2, DialogTitle2 } from "@/components/HomePage/dialog2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import useWindowSize from "@/hooks/useWindow";
import { SearchQueryDialog } from "@/components/MagazinePage/searchQueryDialog";
import { NotificationsDialog } from "@/components/MagazinePage/notificationsDialog";


// Categories
const categories = [
    "All",
    "Technology",
    "Business",
    "Science",
    "Health",
    "Arts",
    "Sports",
    "Politics",
    "Education",
    "Entertainment",
    "Environment",
    "Food",
    "Travel",
    "Fashion",
    "Finance",
    "Lifestyle",
    "World News",
    "Culture",
    "Innovation",
    "Career",
];

// Search Categories
const searchCategories = [
    "All",
    "Polical Parties",
    "Leaders",
]

const notificationCategories = [
    "All",
]


export default function MyMagazinesPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");
    const [activeTab, setActiveTab] = useState("activity");
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();
    const currentUser = useAppSelector((state) => state.user);

    // scrollContainerRef useRef()
    const categoriesScrollRef = useRef<HTMLDivElement>(null);
    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    // setTheme useTheme()
    const { setTheme } = useTheme();

    // useWindowSize
    const { width } = useWindowSize();

    // setMounted useEffect()
    useEffect(() => {
        setMounted(true);
    }, []);  
    
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col min-h-screen bg-muted font-playfair-display">

                {/* Header */}
            <header className=" fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    <div className="flex items-center gap-4">
                        {/* Left - Back Button */}
                        <ChevronLeftIcon className="h-6 w-6 text-primary cursor-pointer" onClick={() => router.back()} />

                        {/* Left - SOMA (Company Logo) */}
                        {typeof window !== 'undefined' && window.innerWidth >= 768 ?
                        <div className="text-3xl font-semibold text-secondary">Magazines</div>
                        :
                            ""
                        }
                    </div>

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
                            <Search className="h-4 w-4 text-primary"/>
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

                {/* Main Content */}
                <main className="flex-1 flex bg-muted mt-[6rem]">
                    {!isAuthenticated ? (
                        <div className="w-full flex flex-col items-center justify-center p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                            <p className="text-gray-600 mb-6">Please log in to view this library page.</p>
                            <Link href="/login">
                                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                    Login To Continue
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                        {/* Left Section - 20% */}
                        <section className=" hidden xl:block w-[18%] bg-muted p-4 fixed h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                            
                        </section>

                        {/* Middle Section - 50% */}
                        <section className="rounded-lg m-2 w-full xl:w-[50%] xl:ml-[20%] bg-background p-2 sm:p-6 md:p-8 xl:p-10 overflow-y-auto">

                            {/* Profile Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">Magazines</h1>
                                </div>
                                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Magazine
                                </Button>
                            </div>

                            {/* Tabs Section */}
                            <Tabs defaultValue="activity" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="activity" className="data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">Magazines</TabsTrigger>
                                    <TabsTrigger value="posts" className="data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">Free Magazines</TabsTrigger>
                                    <TabsTrigger value="likes" className="data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">Monetized Magazines</TabsTrigger>
                                    <TabsTrigger value="reads" className="data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">Exculsive Magazines</TabsTrigger>
                                </TabsList>
                                <TabsContent value="activity" className="mt-4">
                                    <div className="space-y-4">
                                        <p>Your Magazines will be displayed here</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="posts" className="mt-4">
                                    <div className="space-y-4">
                                        <p>Saved Magazines will be displayed here</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="likes" className="mt-4">
                                    <div className="space-y-4">
                                        <p>Highlights will be displayed here</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="reads" className="mt-4">
                                    <div className="space-y-4">
                                        <p>History will be displayed here</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </section>


                        {/* Right Section - 30% */}
                        <section className="hidden xl:block w-[26%] bg-muted p-4 fixed right-4 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                            
                        </section>
                        </>
                    )}
                </main>
            </div>


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
        </div>
    )   
}