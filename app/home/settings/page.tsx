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
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { updateUserField } from "@/redux/user-store/userSlice";
import { useRouter } from "next/navigation";
import useWindowSize from "@/hooks/useWindow";
import { SearchQueryDialog } from "@/components/profile-page/searchQueryDialog";
import { NotificationsDialog } from "@/components/profile-page/notificationsDialog";
import { Toggle } from "@/components/ui/toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { API_BASE_URL } from "@/lib/api-config";


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


export default function SettingsPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");
    const [activeTab, setActiveTab] = useState("activity");
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);
    const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
    const [isSavingContent, setIsSavingContent] = useState(false);


    // router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();
    const currentUser = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    // scrollContainerRef useRef()
    const categoriesScrollRef = useRef<HTMLDivElement>(null);
    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    // setTheme useTheme()
    const { setTheme } = useTheme();

    // useWindowSize
    const { width } = useWindowSize();

    // Add state for Content Preferences
    const [filterExplicitContent, setFilterExplicitContent] = useState(true);
    const [autoPlayVideos, setAutoPlayVideos] = useState(true);
    const [blockedAccounts, setBlockedAccounts] = useState(true);
    const [mutedAccounts, setMutedAccounts] = useState(true);
    const [hiddenPublications, setHiddenPublications] = useState(true);
    const [manageInterests, setManageInterests] = useState(true);


    // Add state for Privacy
    const [showLikesOnProfile, setShowLikesOnProfile] = useState(true);
    const [allowMentions, setAllowMentions] = useState(true);
    const [allowGuestPosts, setAllowGuestPosts] = useState(true);
    const [contactMatching, setContactMatching] = useState(true);

    // useState Magazine Delivery
    const [articleDelivery, setArticleDelivery] = useState<'app' | 'email' | 'number' | 'app&email' | 'all'>("all");
    const [magazineDelivery, setMagazineDelivery] = useState<'app' | 'email' | 'number' | 'app&email' | 'all'>("all");
    const [podcastDelivery, setPodcastDelivery] = useState<'app' | 'email' | 'number' | 'app&email' | 'all'>("all");


    // Engagement options state
    const [engagementLikesApp, setEngagementLikesApp] = useState(true);
    const [engagementLikesEmail, setEngagementLikesEmail] = useState(true);
    const [engagementCommentsApp, setEngagementCommentsApp] = useState(true);
    const [engagementCommentsEmail, setEngagementCommentsEmail] = useState(true);
    const [engagementSharesApp, setEngagementSharesApp] = useState(true);
    const [engagementSharesEmail, setEngagementSharesEmail] = useState(true);
    const [engagementMentionsApp, setEngagementMentionsApp] = useState(true);
    const [engagementMentionsEmail, setEngagementMentionsEmail] = useState(true);

    // Connections options state
    const [connectionsFollowersApp, setConnectionsFollowersApp] = useState(true);
    const [connectionsFollowersEmail, setConnectionsFollowersEmail] = useState(true);
    const [connectionsSubscribersApp, setConnectionsSubscribersApp] = useState(true);
    const [connectionsSubscribersEmail, setConnectionsSubscribersEmail] = useState(true);
    const [connectionsChatsApp, setConnectionsChatsApp] = useState(true);
    const [connectionsChatsEmail, setConnectionsChatsEmail] = useState(true);
    const [connectionsChartsUpdatesApp, setConnectionsChartsUpdatesApp] = useState(true);
    const [connectionsChartsUpdatesEmail, setConnectionsChartsUpdatesEmail] = useState(true);

    // Messaging options state
    const [messagingChatRepliesApp, setMessagingChatRepliesApp] = useState(true);
    const [messagingChatRepliesEmail, setMessagingChatRepliesEmail] = useState(true);
    const [messagingRequestsFrom, setMessagingRequestsFrom] = useState<'Everyone' | 'Paid Subscribers' | 'Free Subscribers' | 'No One'>("Everyone");



    // Function to save notification settings
    const saveNotificationSettings = () => {
        if (!isAuthenticated) {
            console.error("User not authenticated");
            return;
        }

        setIsSavingNotifications(true);

        // Get JWT token from localStorage
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.error("No JWT token found");
            setIsSavingNotifications(false);
            return;
        }

        // Prepare notification settings data
        const notificationData = {
            // magazine useState Values
            magazine_delivery: magazineDelivery,

            // engagement useState Values
            engagement_likes_app: engagementLikesApp,
            engagement_likes_email: engagementLikesEmail,
            engagement_comments_app: engagementCommentsApp,
            engagement_comments_email: engagementCommentsEmail,
            engagement_shares_app: engagementSharesApp,
            engagement_shares_email: engagementSharesEmail,
            engagement_mentions_app: engagementMentionsApp,
            engagement_mentions_email: engagementMentionsEmail,

            // connections useState Values
            connections_followers_app: connectionsFollowersApp,
            connections_followers_email: connectionsFollowersEmail,
            connections_subscribers_app: connectionsSubscribersApp,
            connections_subscribers_email: connectionsSubscribersEmail,
            connections_chats_app: connectionsChatsApp,
            connections_chats_email: connectionsChatsEmail,
            connections_charts_updates_app: connectionsChartsUpdatesApp,
            connections_charts_updates_email: connectionsChartsUpdatesEmail,

            // massaging useState Values
            messaging_chat_replies_app: messagingChatRepliesApp,
            messaging_chat_replies_email: messagingChatRepliesEmail,
            messaging_requests_from: messagingRequestsFrom,
        };

        // Make API call to save to database
        fetch(`${API_BASE_URL}/somaapp/update-notification-settings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(notificationData),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorData => {
                        throw errorData;
                    });
                }
            })
            .then(result => {
                // Update Redux store with new settings using updateUserField
                dispatch(updateUserField({ field: 'articleDelivery', value: articleDelivery }));
                dispatch(updateUserField({ field: 'magazineDelivery', value: magazineDelivery }));
                dispatch(updateUserField({ field: 'podcastDelivery', value: podcastDelivery }));
                dispatch(updateUserField({ field: 'engagementLikesApp', value: engagementLikesApp }));
                dispatch(updateUserField({ field: 'engagementLikesEmail', value: engagementLikesEmail }));
                dispatch(updateUserField({ field: 'engagementCommentsApp', value: engagementCommentsApp }));
                dispatch(updateUserField({ field: 'engagementCommentsEmail', value: engagementCommentsEmail }));
                dispatch(updateUserField({ field: 'engagementSharesApp', value: engagementSharesApp }));
                dispatch(updateUserField({ field: 'engagementSharesEmail', value: engagementSharesEmail }));
                dispatch(updateUserField({ field: 'engagementMentionsApp', value: engagementMentionsApp }));
                dispatch(updateUserField({ field: 'engagementMentionsEmail', value: engagementMentionsEmail }));
                dispatch(updateUserField({ field: 'connectionsFollowersApp', value: connectionsFollowersApp }));
                dispatch(updateUserField({ field: 'connectionsFollowersEmail', value: connectionsFollowersEmail }));
                dispatch(updateUserField({ field: 'connectionsSubscribersApp', value: connectionsSubscribersApp }));
                dispatch(updateUserField({ field: 'connectionsSubscribersEmail', value: connectionsSubscribersEmail }));
                dispatch(updateUserField({ field: 'connectionsChatsApp', value: connectionsChatsApp }));
                dispatch(updateUserField({ field: 'connectionsChatsEmail', value: connectionsChatsEmail }));
                dispatch(updateUserField({ field: 'connectionsChartsUpdatesApp', value: connectionsChartsUpdatesApp }));
                dispatch(updateUserField({ field: 'connectionsChartsUpdatesEmail', value: connectionsChartsUpdatesEmail }));
                dispatch(updateUserField({ field: 'messagingChatRepliesApp', value: messagingChatRepliesApp }));
                dispatch(updateUserField({ field: 'messagingChatRepliesEmail', value: messagingChatRepliesEmail }));
                dispatch(updateUserField({ field: 'messagingRequestsFrom', value: messagingRequestsFrom }));

                console.log("Notification settings saved successfully:", result);
                // You can add a toast notification here
            })
            .catch(error => {
                console.error("Failed to save notification settings:", error);
                // You can add error toast notification here
            })
            .finally(() => {
                setIsSavingNotifications(false);
            });
    };

    // Function to save content preferences
    const saveContentPreferences = () => {
        if (!isAuthenticated) {
            console.error("User not authenticated");
            return;
        }

        setIsSavingContent(true);

        // Get JWT token from localStorage
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.error("No JWT token found");
            setIsSavingContent(false);
            return;
        }

        // Prepare content preferences data
        const contentData = {
            filter_explicit_content: filterExplicitContent,
            auto_play_videos: autoPlayVideos,
            blocked_accounts: blockedAccounts,
            muted_accounts: mutedAccounts,
            hidden_publications: hiddenPublications,
            manage_interests: manageInterests,
        };

        // Make API call to save to database
        fetch(`${API_BASE_URL}/somaapp/update-content-preferences/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(contentData),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorData => {
                        throw errorData;
                    });
                }
            })
            .then(result => {
                // Update Redux store with new settings using updateUserField
                dispatch(updateUserField({ field: 'filterExplicitContent', value: filterExplicitContent }));
                dispatch(updateUserField({ field: 'autoPlayVideos', value: autoPlayVideos }));
                dispatch(updateUserField({ field: 'blockedAccounts', value: blockedAccounts }));
                dispatch(updateUserField({ field: 'mutedAccounts', value: mutedAccounts }));
                dispatch(updateUserField({ field: 'hiddenPublications', value: hiddenPublications }));
                dispatch(updateUserField({ field: 'manageInterests', value: manageInterests }));

                console.log("Content preferences saved successfully:", result);
                // You can add a toast notification here
            })
            .catch(error => {
                console.error("Failed to save content preferences:", error);
                // You can add error toast notification here
            })
            .finally(() => {
                setIsSavingContent(false);
            });
    };

    // Function to save privacy settings
    const savePrivacySettings = () => {
        if (!isAuthenticated) {
            console.error("User not authenticated");
            return;
        }

        setIsSavingPrivacy(true);

        // Get JWT token from localStorage
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.error("No JWT token found");
            setIsSavingPrivacy(false);
            return;
        }

        // Prepare privacy settings data
        const privacyData = {
            show_likes_on_profile: showLikesOnProfile,
            allow_mentions: allowMentions,
            allow_guest_posts: allowGuestPosts,
            contact_matching: contactMatching,
        };

        // Make API call to save to database
        fetch(`${API_BASE_URL}/somaapp/update-privacy-settings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify(privacyData),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errorData => {
                        throw errorData;
                    });
                }
            })
            .then(result => {
                // Update Redux store with new settings using updateUserField
                dispatch(updateUserField({ field: 'showLikesOnProfile', value: showLikesOnProfile }));
                dispatch(updateUserField({ field: 'allowMentions', value: allowMentions }));
                dispatch(updateUserField({ field: 'allowGuestPosts', value: allowGuestPosts }));
                dispatch(updateUserField({ field: 'contactMatching', value: contactMatching }));

                console.log("Privacy settings saved successfully:", result);
                // You can add a toast notification here
            })
            .catch(error => {
                console.error("Failed to save privacy settings:", error);
                // You can add error toast notification here
            })
            .finally(() => {
                setIsSavingPrivacy(false);
            });
    };

    // setMounted useEffect()
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load notification settings from Redux on component mount
    useEffect(() => {
        if (currentUser) {
            setArticleDelivery((currentUser.articleDelivery as 'app' | 'email' | 'number' | 'app&email' | 'all') || "all");
            setMagazineDelivery((currentUser.magazineDelivery as 'app' | 'email' | 'number' | 'app&email' | 'all') || "all");
            setPodcastDelivery((currentUser.podcastDelivery as 'app' | 'email' | 'number' | 'app&email' | 'all') || "all");
            setEngagementLikesApp(currentUser.engagementLikesApp || false);
            setEngagementLikesEmail(currentUser.engagementLikesEmail || false);
            setEngagementCommentsApp(currentUser.engagementCommentsApp || false);
            setEngagementCommentsEmail(currentUser.engagementCommentsEmail || false);
            setEngagementSharesApp(currentUser.engagementSharesApp || false);
            setEngagementSharesEmail(currentUser.engagementSharesEmail || false);
            setEngagementMentionsApp(currentUser.engagementMentionsApp || false);
            setEngagementMentionsEmail(currentUser.engagementMentionsEmail || false);
            setConnectionsFollowersApp(currentUser.connectionsFollowersApp || false);
            setConnectionsFollowersEmail(currentUser.connectionsFollowersEmail || false);
            setConnectionsSubscribersApp(currentUser.connectionsSubscribersApp || false);
            setConnectionsSubscribersEmail(currentUser.connectionsSubscribersEmail || false);
            setConnectionsChatsApp(currentUser.connectionsChatsApp || false);
            setConnectionsChatsEmail(currentUser.connectionsChatsEmail || false);
            setConnectionsChartsUpdatesApp(currentUser.connectionsChartsUpdatesApp || false);
            setConnectionsChartsUpdatesEmail(currentUser.connectionsChartsUpdatesEmail || false);
            setMessagingChatRepliesApp(currentUser.messagingChatRepliesApp || false);
            setMessagingChatRepliesEmail(currentUser.messagingChatRepliesEmail || false);
            setMessagingRequestsFrom((currentUser.messagingRequestsFrom as 'Everyone' | 'Paid Subscribers' | 'Free Subscribers' | 'No One') || "Everyone");

            // Load content preferences from Redux
            setFilterExplicitContent(currentUser.filterExplicitContent || false);
            setAutoPlayVideos(currentUser.autoPlayVideos || false);
            setBlockedAccounts(currentUser.blockedAccounts || false);
            setMutedAccounts(currentUser.mutedAccounts || false);
            setHiddenPublications(currentUser.hiddenPublications || false);
            setManageInterests(currentUser.manageInterests || false);

            // Load privacy settings from Redux
            setShowLikesOnProfile(currentUser.showLikesOnProfile || false);
            setAllowMentions(currentUser.allowMentions || false);
            setAllowGuestPosts(currentUser.allowGuestPosts || false);
            setContactMatching(currentUser.contactMatching || false);
        }
    }, [currentUser]);



    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col min-h-screen bg-muted font-playfair-display">

                {/* Header */}
                <header className="border-b bg-white fixed top-0 left-0 right-0 z-50 bg-background">
                    <div className="flex items-center justify-between px-6 py-4 bg-background">

                        <div className="flex items-center gap-4">
                            {/* Left - Back Button */}
                            <ChevronLeftIcon className="h-6 w-6 text-primary cursor-pointer" onClick={() => router.back()} />

                            {/* Left - SOMA (Company Logo) */}
                            {typeof window !== 'undefined' && window.innerWidth >= 768 ?
                                <div className="text-3xl font-semibold text-secondary">Settings</div>
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

                {/* Main Content */}
                <main className="flex-1 flex bg-muted mt-[4.5rem]">


                    {!isAuthenticated ? (
                        <div className="w-full flex flex-col items-center justify-center p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                            <p className="text-gray-600 mb-6">Please log in to view this settings page.</p>
                            <Link href="/authentication">
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
                            <section className="rounded-lg m-2 w-full xl:w-[50%] xl:ml-[20%] bg-background p-2 sm:p-6 md:p-8 xl:p-10 overflow-y-auto space-y-10">

                                {/* Account Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account</h2>
                                    <div className="flex items-center justify-between bg-muted rounded-3xl p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-blue-500">
                                                {currentUser.profilePicture ? (
                                                    <Image src={currentUser.profilePicture} alt="Profile" fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 text-3xl font-bold">
                                                        {currentUser.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold">{currentUser.fullName || currentUser.username}</div>
                                                <div className="text-gray-500 text-sm">{currentUser.email}</div>
                                            </div>
                                        </div>
                                        <Button onClick={() => router.push("/home/profile/edit-profile")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer">
                                            Edit
                                        </Button>
                                    </div>
                                </div>

                                {/* Publications Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Publications</h2>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-700">Your Publications</span>
                                        <Button onClick={() => router.push("/create-publication")} className="cursor-pointer bg-secondary text-primary-foreground hover:bg-secondary/90 flex flex-row align-center justify-center">
                                            Create Publication
                                        </Button>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4 text-gray-500 text-center ">No publications yet.</div>
                                </div>

                                {/* Subscriptions Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Subscriptions</h2>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Input type="text" placeholder="Search subscriptions..." className="max-w-full" />
                                    </div>
                                    <div className="bg-muted rounded-lg p-4 text-gray-500 text-center">No subscriptions found.</div>
                                </div>

                                {/* Notifications Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Notifications</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* Articles Delivery Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="py-6.5" asChild>
                                                <Button variant="outline" className="w-full flex justify-between items-center">
                                                    Article Delivery
                                                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="font-playfair-display">
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer App <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="article-delivery"
                                                            value="app"
                                                            checked={articleDelivery === "app"}
                                                            onChange={() => setArticleDelivery("app")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer E-mail <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="article-delivery"
                                                            value="email"
                                                            checked={articleDelivery === "email"}
                                                            onChange={() => setArticleDelivery("email")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer Number <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="article-delivery"
                                                            value="number"
                                                            checked={articleDelivery === "number"}
                                                            onChange={() => setArticleDelivery("number")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer App And Email <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="article-delivery"
                                                            value="app&email"
                                                            checked={articleDelivery === "app&email"}
                                                            onChange={() => setArticleDelivery("app&email")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer All <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="article-delivery"
                                                            value="all"
                                                            checked={articleDelivery === "all"}
                                                            onChange={() => setArticleDelivery("all")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>


                                        {/* Magazine Delivery Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="py-6.5" asChild>
                                                <Button variant="outline" className="w-full flex justify-between items-center">
                                                    Magazine Delivery
                                                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="font-playfair-display">
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer App <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="magazine-delivery"
                                                            value="app"
                                                            checked={magazineDelivery === "app"}
                                                            onChange={() => setMagazineDelivery("app")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer E-mail <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="magazine-delivery"
                                                            value="email"
                                                            checked={magazineDelivery === "email"}
                                                            onChange={() => setMagazineDelivery("email")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer Number <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="magazine-delivery"
                                                            value="number"
                                                            checked={magazineDelivery === "number"}
                                                            onChange={() => setMagazineDelivery("number")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer App And Email <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="magazine-delivery"
                                                            value="app&email"
                                                            checked={magazineDelivery === "app&email"}
                                                            onChange={() => setMagazineDelivery("app&email")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer All <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="magazine-delivery"
                                                            value="all"
                                                            checked={magazineDelivery === "all"}
                                                            onChange={() => setMagazineDelivery("all")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        {/* Podcasts Delivery Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="py-6.5" asChild>
                                                <Button variant="outline" className="w-full flex justify-between items-center">
                                                    Podcast Delivery
                                                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="font-playfair-display">
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer App <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="podcast-delivery"
                                                            value="app"
                                                            checked={podcastDelivery === "app"}
                                                            onChange={() => setPodcastDelivery("app")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer E-mail <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="podcast-delivery"
                                                            value="email"
                                                            checked={podcastDelivery === "email"}
                                                            onChange={() => setPodcastDelivery("email")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer Number <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="podcast-delivery"
                                                            value="number"
                                                            checked={podcastDelivery === "number"}
                                                            onChange={() => setPodcastDelivery("number")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer App And Email <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="podcast-delivery"
                                                            value="app&email"
                                                            checked={podcastDelivery === "app&email"}
                                                            onChange={() => setPodcastDelivery("app&email")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex flex-row items-center justify-center gap-2" asChild>
                                                    <label className="flex items-center gap-2 w-full cursor-pointer">
                                                        <span className="text-[14px] font-bold w-full text-left">Prefer All <span className="font-normal">(Delivery Preference)</span></span>
                                                        <input
                                                            type="radio"
                                                            name="podcast-delivery"
                                                            value="all"
                                                            checked={podcastDelivery === "all"}
                                                            onChange={() => setPodcastDelivery("all")}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                    </label>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>


                                        {/* Engagement Options */}
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1" className="border rounded-lg px-3 shadow">
                                                <AccordionTrigger>Engagement</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4">

                                                        {/* Likes Option  */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Likes</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementLikesApp} onChange={e => setEngagementLikesApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementLikesEmail} onChange={e => setEngagementLikesEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Comments Option  */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Comments</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementCommentsApp} onChange={e => setEngagementCommentsApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementCommentsEmail} onChange={e => setEngagementCommentsEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Shares Options */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Shares</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementSharesApp} onChange={e => setEngagementSharesApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementSharesEmail} onChange={e => setEngagementSharesEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Mentions */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Mentions</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementMentionsApp} onChange={e => setEngagementMentionsApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={engagementMentionsEmail} onChange={e => setEngagementMentionsEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>


                                        {/* Messaging Options */}
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1" className="border rounded-lg px-3 shadow">
                                                <AccordionTrigger>Messaging</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4">

                                                        {/* Chat Replies Option  */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Chat Replies</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={messagingChatRepliesApp} onChange={e => setMessagingChatRepliesApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={messagingChatRepliesEmail} onChange={e => setMessagingChatRepliesEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Allow Message Requests From */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Allow Message Requests From</span>
                                                            <div className="flex gap-4">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="outline" className="w-full text-sm flex justify-between items-center">
                                                                            {messagingRequestsFrom}
                                                                            <ChevronRightIcon className="h-4 w-4 ml-2" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="start" className="font-playfair-display">
                                                                        <DropdownMenuItem asChild>
                                                                            <label className="flex items-center gap-2 w-full cursor-pointer">
                                                                                <input type="radio" name="messaging-requests-from" value="Everyone" className="accent-primary" checked={messagingRequestsFrom === "Everyone"} onChange={() => setMessagingRequestsFrom("Everyone")} />
                                                                                <span>Everyone</span>
                                                                            </label>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem asChild>
                                                                            <label className="flex items-center gap-2 w-full cursor-pointer">
                                                                                <input type="radio" name="messaging-requests-from" value="Paid Subscribers" className="accent-primary" checked={messagingRequestsFrom === "Paid Subscribers"} onChange={() => setMessagingRequestsFrom("Paid Subscribers")} />
                                                                                <span>Paid Subscribers</span>
                                                                            </label>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem asChild>
                                                                            <label className="flex items-center gap-2 w-full cursor-pointer">
                                                                                <input type="radio" name="messaging-requests-from" value="Free Subscribers" className="accent-primary" checked={messagingRequestsFrom === "Free Subscribers"} onChange={() => setMessagingRequestsFrom("Free Subscribers")} />
                                                                                <span>Free Subscribers</span>
                                                                            </label>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem asChild>
                                                                            <label className="flex items-center gap-2 w-full cursor-pointer">
                                                                                <input type="radio" name="messaging-requests-from" value="No One" className="accent-primary" checked={messagingRequestsFrom === "No One"} onChange={() => setMessagingRequestsFrom("No One")} />
                                                                                <span>No One</span>
                                                                            </label>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        {/* Connections Options */}
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1" className="border rounded-lg px-3 shadow">
                                                <AccordionTrigger>Connections</AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4">

                                                        {/* New Followers Option  */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">New Followers</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsFollowersApp} onChange={e => setConnectionsFollowersApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsFollowersEmail} onChange={e => setConnectionsFollowersEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* New Subscribers Option  */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">New Subscribers</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsSubscribersApp} onChange={e => setConnectionsSubscribersApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsSubscribersEmail} onChange={e => setConnectionsSubscribersEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* New Chats Option */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">New Chats</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsChatsApp} onChange={e => setConnectionsChatsApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsChatsEmail} onChange={e => setConnectionsChatsEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        {/* Charts Updates Option */}
                                                        <div className="flex items-center justify-between py-2">
                                                            <span className="text-sm">Charts Updates</span>
                                                            <div className="flex gap-4">
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsChartsUpdatesApp} onChange={e => setConnectionsChartsUpdatesApp(e.target.checked)} />
                                                                    <span>App</span>
                                                                </label>
                                                                <label className="flex items-center gap-1 cursor-pointer">
                                                                    <input type="checkbox" className="accent-primary" checked={connectionsChartsUpdatesEmail} onChange={e => setConnectionsChartsUpdatesEmail(e.target.checked)} />
                                                                    <span>Email</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={saveNotificationSettings}
                                            disabled={isSavingNotifications}
                                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
                                        >
                                            {isSavingNotifications ? "Saving..." : "Save Notifications Settings"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Content Preferences Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Content Preferences</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Filter explicit Content</span>
                                            <input type="checkbox" className="accent-primary" checked={filterExplicitContent} onChange={e => setFilterExplicitContent(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Auto-Play Videos</span>
                                            <input type="checkbox" className="accent-primary" checked={autoPlayVideos} onChange={e => setAutoPlayVideos(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Blocked Accounts</span>
                                            <input type="checkbox" className="accent-primary" checked={blockedAccounts} onChange={e => setBlockedAccounts(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Muted Accounts</span>
                                            <input type="checkbox" className="accent-primary" checked={mutedAccounts} onChange={e => setMutedAccounts(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Hidden Publications</span>
                                            <input type="checkbox" className="accent-primary" checked={hiddenPublications} onChange={e => setHiddenPublications(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Manage Interests</span>
                                            <input type="checkbox" className="accent-primary" checked={manageInterests} onChange={e => setManageInterests(e.target.checked)} />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={saveContentPreferences}
                                            disabled={isSavingContent}
                                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
                                        >
                                            {isSavingContent ? "Saving..." : "Save Content Preferences"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Privacy Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Privacy</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Show Likes On Profile</span>
                                            <input type="checkbox" className="accent-primary" checked={showLikesOnProfile} onChange={e => setShowLikesOnProfile(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Allow Mentions</span>
                                            <input type="checkbox" className="accent-primary" checked={allowMentions} onChange={e => setAllowMentions(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Allow Guest Posts</span>
                                            <input type="checkbox" className="accent-primary" checked={allowGuestPosts} onChange={e => setAllowGuestPosts(e.target.checked)} />
                                        </div>
                                        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                                            <span>Contact Matching</span>
                                            <input type="checkbox" className="accent-primary" checked={contactMatching} onChange={e => setContactMatching(e.target.checked)} />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={savePrivacySettings}
                                            disabled={isSavingPrivacy}
                                            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
                                        >
                                            {isSavingPrivacy ? "Saving..." : "Save Privacy Settings"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Delete Account Section */}
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-red-600 mb-2">Danger Zone</h2>
                                    <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                                        <span className="text-gray-700">Permanently delete your account and all associated data.</span>
                                        <Button variant="destructive">Delete Account</Button>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                                        <span className="text-gray-700">Sign Out, All Your Data Will Be Kept</span>
                                        <Button variant="destructive">Sign Out</Button>
                                    </div>
                                </div>
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