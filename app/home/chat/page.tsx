'use client';

import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Settings, Plus, Mail, Bell, Pen, Mic, Book, Compass, Paperclip, Send, UserCircleIcon } from "lucide-react";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog3, DialogContent3, DialogHeader3, DialogTitle3 } from "@/components/ChatPage/dialog3";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { Dialog2, DialogHeader2, DialogContent2, DialogTitle2 } from "@/components/HomePage/dialog2";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useAppSelector } from "@/redux/hooks";

interface UserState {
    fullName?: string;
    profilePicture?: string;
    username: string;
    // ... other user properties
}

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

export default function ChatPage() {
    // Router
    const router = useRouter();

    // isAuthenticated
    const { isAuthenticated } = useAuth();

    // Theme
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Width state
    const [width, setWidth] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Search Query useState()
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    // Chat state
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [showMobileChat, setShowMobileChat] = useState(false);

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    // Search Categories Scroll Ref
    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    const currentUser = useAppSelector((state) => state.user);

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // Mounted and width effect
    useEffect(() => {
        setMounted(true);
        const updateWidth = () => {
            setWidth(window.innerWidth);
            setIsMobile(window.innerWidth < 768);
        };
        
        // Set initial width
        updateWidth();
        
        // Add event listener
        window.addEventListener('resize', updateWidth);
        
        // Cleanup
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

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

    if (!mounted) {
        return null; // Return null on server-side and first render
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col min-h-screen bg-muted font-playfair-display">
                {/* Header */}
                <header className="border-b bg-white fixed top-0 left-0 right-0 z-50 bg-background">
                    <div className="flex items-center justify-between px-6 py-4 bg-background">
                        <div className="flex items-center gap-4">
                            <ChevronLeftIcon className="h-6 w-6 text-primary cursor-pointer" onClick={() => router.back()} />
                            <div className="text-3xl font-semibold text-secondary">Chats</div>
                        </div>

                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="cursor-pointer">
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
                    </div>
                </header>

                {/* Login Prompt */}
                <main className="flex-1 flex flex-col items-center justify-center gap-4 p-4 mt-16">
                    <h3 className="text-xl font-semibold text-center">Please Login to View Chats</h3>
                    <p className="text-sm text-gray-600 text-center">
                        Create an account or login to access your messages and start conversations.
                    </p>
                    <Link href="/login" className="w-full flex justify-center">
                        <Button 
                            className="w-[160px] bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                        >
                            Login to Continue
                        </Button>
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted font-playfair-display">
            
            {/* Header */}
            <header className="border-b bg-white fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">
                    <div className="flex items-center gap-4">
                        <ChevronLeftIcon className="h-6 w-6 text-primary cursor-pointer" onClick={() => router.back()} />
                        {!isMobile ? (
                            <div className="text-3xl font-semibold text-secondary">Chats</div>
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
                    </div>

                    {/* Middle - Search Bar */}
                    {!isMobile ? (
                        <div className="flex-1 max-w-xl mx-2 bg-background">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full placeholder:hidden md:placeholder:block"
                                    onClick={() => isMobile ? router.push("/home/search") : setSearchQueryModal(true)}
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
                        <Link href="/dashboard">
                            {isMobile ? (
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

                        {/* Bell Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                            onClick={() => isMobile ? router.push("/home/notifications") : setNotificationsModal(true)}
                        >
                            <Bell className="h-6 w-6" />
                        </Button>

                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="cursor-pointer">
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
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 mt-16">
                {!isAuthenticated ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
                        <h3 className="text-xl font-semibold text-center">Please Login to View Chats</h3>
                        <p className="text-sm text-gray-600 text-center">
                            Create an account or login to access your messages and start conversations.
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
                    <div className="flex h-[calc(100vh-8rem)] gap-4">

                        {/* Left Section - 40% */}
                        <div className={`w-full md:w-[40%] ${showMobileChat ? 'hidden md:block' : 'block'} bg-background rounded-lg shadow-sm p-4 flex flex-col`}>

                            {/* Search Bar with Write Icon */}
                            <div className="flex gap-2 mb-4">
                                <div className="relative flex-1">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search messages..."
                                        className="pl-10 w-full"
                                    />
                                </div>
                                <Button size="icon" className="bg-secondary hover:bg-secondary/90 cursor-pointer">
                                    <Pen className="h-5 w-5 text-white" />
                                </Button>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="w-full h-10 justify-start">
                                    <TabsTrigger value="all" className="cursor-pointer p-4 py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">All</TabsTrigger>
                                    <TabsTrigger value="direct" className="cursor-pointer p-4 py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">Direct</TabsTrigger>
                                    <TabsTrigger value="unread" className="cursor-pointer p-4 py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50">Unread</TabsTrigger>
                                </TabsList>

                                {/* Messages List */}
                                <div className="mt-4 flex-1 overflow-y-auto">
                                    <TabsContent value="all" className="mt-0">
                                        {/* Sample message - replace with actual data */}
                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="p-3 hover:bg-muted rounded-lg cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedChat(i);
                                                        setShowMobileChat(true);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-muted"></div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium">User {i}</h4>
                                                            <p className="text-sm text-gray-500">Last message preview...</p>
                                                        </div>
                                                        <div className="text-xs text-gray-400">2m ago</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="direct" className="mt-0">
                                        {/* Direct messages content */}
                                    </TabsContent>
                                    <TabsContent value="unread" className="mt-0">
                                        {/* Unread messages content */}
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>

                        {/* Right Section - 60% */}
                        <div className={`w-full md:w-[60%] ${showMobileChat ? 'block' : 'hidden'} md:block bg-background rounded-lg shadow-sm p-4 flex flex-col relative`}>
                            {/* Chat Header */}
                                <div className="border-b pb-4">
                                    <div className="flex items-center cursor-pointer mr-4">
                                        <ChevronLeftIcon onClick={() => setShowMobileChat(false)} className={`h-7 w-7 ${showMobileChat ? 'block' : 'hidden'}`} />
                                    <div className="w-12 h-12 rounded-full bg-muted">

                                    </div>
                                    <div>
                                        <h3 className="font-medium">User {selectedChat}</h3>
                                        <p className="text-sm text-gray-500">Online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto py-4 mb-16">
                                {/* Sample messages - replace with actual data */}
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-lg ${i % 2 === 0 ? 'bg-secondary text-white' : 'bg-muted'
                                                }`}>
                                                <p>This is a sample message {i}</p>
                                                <span className="text-xs opacity-70">2m ago</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Message Input */}
                            <div className="border-t pt-4 absolute bottom-0 left-0 right-0 bg-background p-4 rounded-b-lg">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button size="icon" className="bg-secondary hover:bg-secondary/90 cursor-pointer">
                                        <Send className="h-5 w-5 text-white" />
                                    </Button>
                                    <Button size="icon" className="bg-secondary hover:bg-secondary/90 cursor-pointer">
                                        <Paperclip className="h-5 w-5 text-white" />
                                    </Button>
                                    <Button size="icon" className="bg-secondary hover:bg-secondary/90 cursor-pointer">
                                        <Mic className="h-5 w-5 text-white" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>


            {/* Notifications Modal */}
            <Dialog3
                open={notificationsModal}
                onOpenChange={(open: boolean) => !open && setNotificationsModal(false)}
            >
                <DialogContent3 className="sm:max-w-[500px] max-w-[380px] rounded-lg font-playfair-display h-[600px] flex flex-col">

                    {/* Create Content Modal Header */}
                    <DialogHeader3>
                        <DialogTitle3 className="text-2xl font-bold">Notifications</DialogTitle3>
                    </DialogHeader3>

                    {/* Categories Container */}
                    <div
                        ref={notificationCategoriesScrollRef}
                        className="flex items-center justify-start space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {notificationCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveNotificationCategory(category)}
                                className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${activeNotificationCategory === category
                                        ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-sm"
                                        : "text-primary bg-muted hover:text-blue-600 hover:bg-muted px-4 py-2 rounded-sm"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results Section */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Sample result items - replace with actual data */}
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <h4 className="font-medium">Result Item 1</h4>
                                <p className="text-sm text-gray-600">Description of result item 1</p>
                            </div>
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <h4 className="font-medium">Result Item 2</h4>
                                <p className="text-sm text-gray-600">Description of result item 2</p>
                            </div>
                        </div>
                    </div>
                </DialogContent3>
            </Dialog3>



            {/* Search Query Modal */}
            <Dialog2
                open={searchQueryModal}
                onOpenChange={(open: boolean) => !open && setSearchQueryModal(false)}
            >
                <DialogContent2 className="sm:max-w-[500px] max-w-[380px] rounded-lg font-playfair-display h-[600px] flex flex-col">

                    {/* Create Content Modal Header */}
                    <DialogHeader2>
                        <DialogTitle2 className="text-2xl font-bold">Search</DialogTitle2>
                    </DialogHeader2>

                    {/* Search Input Section */}
                    <div className="relative mt-1">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>

                    {/* Categories Container */}
                    <div
                        ref={searchCategoriesScrollRef}
                        className="flex items-center justify-start space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {searchCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveSearchCategory(category)}
                                className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${activeSearchCategory === category
                                        ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-sm"
                                        : "text-primary bg-muted hover:text-blue-600 hover:bg-muted px-4 py-2 rounded-sm"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results Section */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Sample result items - replace with actual data */}
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <h4 className="font-medium">Result Item 1</h4>
                                <p className="text-sm text-gray-600">Description of result item 1</p>
                            </div>
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <h4 className="font-medium">Result Item 2</h4>
                                <p className="text-sm text-gray-600">Description of result item 2</p>
                            </div>
                        </div>
                    </div>
                </DialogContent2>
            </Dialog2>
        </div>
    );
} 