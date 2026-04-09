'use client';

import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, MessageSquare, Heart, UserPlus, Search, Mail, LayoutDashboard, Sun, Moon, ChevronLeftIcon, Mic } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useAppSelector } from "@/redux/hooks";

export default function NotificationsPage() {
    const { isAuthenticated } = useAuth();
    const [activeNotificationCategory, setActiveNotificationCategory] = useState('All');
    const notificationCategories = ['All', 'Comments', 'Likes', 'Followers'];
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [width, setWidth] = useState(0);
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [notificationsModal, setNotificationsModal] = useState(false);

    const currentUser = useAppSelector((state) => state.user);

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => setWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">

            {/* Main Content */}
            <main className="flex-1 p-3">
                {isAuthenticated ? (
                    <>

                        <div className=" flex flex-row justify-around align-center w-full mb-2">

                            <div className="flex justify-center items-center pr-2">
                                <ChevronLeftIcon className="h-8 w-8 text-primary" onClick={() => router.back()} />
                            </div>

                            <div className="relative flex flex-row justify-center align-center w-full">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-base"
                                />
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>

                            <div className="flex justify-center items-center pl-2">
                                <Mic className="h-8 w-8 text-primary" onClick={() => router.back()} />
                            </div>

                        </div>

                        {/* Categories Container */}
                        <div className="flex items-center justify-start space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mb-3">
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

                        {/* Notifications List */}
                        <div className="space-y-4">
                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                                            <UserPlus className="h-5 w-5 text-secondary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">John Doe started following you</h4>
                                        <p className="text-sm text-gray-600 mt-1">2 hours ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                                            <MessageSquare className="h-5 w-5 text-secondary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">Jane Smith commented on your post</h4>
                                        <p className="text-sm text-gray-600 mt-1">5 hours ago</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
                                            <Heart className="h-5 w-5 text-secondary" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">Alex Johnson liked your post</h4>
                                        <p className="text-sm text-gray-600 mt-1">1 day ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
                        <h3 className="text-xl font-semibold text-center">Please Login to View Notifications</h3>
                        <p className="text-sm text-gray-600 text-center">
                            Create an account or login to stay updated with your notifications.
                        </p>
                        <Link href="/login" className="w-full flex justify-center">
                            <Button
                                className="w-[160px] bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                            >
                                Login to Continue
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
} 