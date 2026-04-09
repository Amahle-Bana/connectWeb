'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Search, UserCircleIcon } from 'lucide-react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NotificationsDialog } from '@/components/PodcastsPage/notificationsDialog';
import { SearchQueryDialog } from '@/components/PodcastsPage/searchQueryDialog';
import { UserSidebar } from '@/components/HomePage/userSidebar';
import { fetchCandidateById, Candidate } from '@/lib/soma-api';
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandThreads,
    IconBrandTiktok,
    IconBrandX,
    IconBrandYoutube,
    IconWorld,
} from '@tabler/icons-react';
import { ArrowLeft } from 'lucide-react';

const searchCategories = ['All', 'Political Parties', 'Leaders'];
const notificationCategories = ['All'];

export default function CouncillorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = typeof params.id === 'string' ? parseInt(params.id, 10) : NaN;
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState('All');
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState('All');
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
    const [profileImageError, setProfileImageError] = useState(false);
    const { theme, setTheme } = useTheme();
    const showInitial = !candidate?.profile_picture || profileImageError;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (Number.isNaN(id)) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setNotFound(false);
        fetchCandidateById(id)
            .then((c) => {
                if (!cancelled) {
                    setCandidate(c);
                    setNotFound(!c);
                }
            })
            .catch(() => {
                if (!cancelled) setNotFound(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    useEffect(() => {
        setProfileImageError(false);
    }, [candidate?.id]);

    const openUrl = (url: string) => {
        if (url.startsWith('http')) window.open(url, '_blank');
        else window.open(`https://${url}`, '_blank');
    };

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

            <main className="flex-1 p-6 mt-[2rem] bg-background">
                <section className="hidden xl:block w-[18%] bg-background p-4 fixed h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" />
                <section className="rounded-lg m-2 w-full xl:w-[50%] xl:ml-[20%] bg-background p-2 sm:p-6 md:p-8 xl:p-10 overflow-y-auto">
                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 bg-muted rounded w-1/3" />
                            <div className="h-24 bg-muted rounded w-full" />
                            <div className="h-10 bg-muted rounded w-1/2" />
                        </div>
                    )}

                    {!loading && notFound && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">Councillor not found.</p>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/home/popular-councillors')}
                                className="cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Popular Councillors
                            </Button>
                        </div>
                    )}

                    {!loading && candidate && (
                        <>
                            <div className="mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/home/popular-councillors')}
                                    className="cursor-pointer -ml-2"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex flex-col w-full h-full">
                                    <div className="flex flex-row align-center justify-between">
                                        <div className="flex flex-col">
                                            <h1 className="text-3xl font-bold">{candidate.candidate_name}</h1>
                                            <p className="text-gray-500 text-md">
                                                {candidate.department || candidate.structure || 'Councillor'}
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-blue-500 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                                {candidate.profile_picture && !showInitial ? (
                                                    <Image
                                                        src={candidate.profile_picture}
                                                        alt={candidate.candidate_name}
                                                        fill
                                                        className="object-cover"
                                                        onError={() => setProfileImageError(true)}
                                                    />
                                                ) : (
                                                    <span className="text-blue-500 text-4xl font-bold">
                                                        {candidate.candidate_name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <span>{candidate.votes} votes</span>
                                        {candidate.supporters_count != null && (
                                            <span>· {candidate.supporters_count} supporters</span>
                                        )}
                                    </div>
                                    {/* {candidate.manifesto && (
                                        <div className="flex w-full h-full pr-2 py-2 mt-2">
                                            <p className="text-gray-500 text-sm">{candidate.manifesto}</p>
                                        </div>
                                    )} */}
                                    <div className="flex flex-row align-center justify-start w-full h-full pr-2 gap-2 mt-2">
                                        {candidate.website && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => openUrl(candidate.website!)}
                                            >
                                                <IconWorld className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {candidate.facebook && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50"
                                                onClick={() => openUrl(candidate.facebook!)}
                                            >
                                                <IconBrandFacebook className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        )}
                                        {candidate.instagram && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-pink-50"
                                                onClick={() =>
                                                    openUrl(
                                                        candidate.instagram!.startsWith('http')
                                                            ? candidate.instagram!
                                                            : `https://instagram.com/${candidate.instagram}`
                                                    )
                                                }
                                            >
                                                <IconBrandInstagram className="h-4 w-4 text-pink-600" />
                                            </Button>
                                        )}
                                        {(candidate.x || candidate.twitter) && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-black/5"
                                                onClick={() =>
                                                    openUrl(
                                                        (candidate.x || candidate.twitter)!.startsWith('http')
                                                            ? (candidate.x || candidate.twitter)!
                                                            : `https://x.com/${candidate.x || candidate.twitter}`
                                                    )
                                                }
                                            >
                                                <IconBrandX className="h-4 w-4 text-black" />
                                            </Button>
                                        )}
                                        {candidate.threads && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-black/5"
                                                onClick={() =>
                                                    openUrl(
                                                        candidate.threads!.startsWith('http')
                                                            ? candidate.threads!
                                                            : `https://threads.net/@${candidate.threads}`
                                                    )
                                                }
                                            >
                                                <IconBrandThreads className="h-4 w-4 text-black" />
                                            </Button>
                                        )}
                                        {candidate.youtube && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-50"
                                                onClick={() => openUrl(candidate.youtube!)}
                                            >
                                                <IconBrandYoutube className="h-4 w-4 text-red-600" />
                                            </Button>
                                        )}
                                        {candidate.linkedin && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-50"
                                                onClick={() => openUrl(candidate.linkedin!)}
                                            >
                                                <IconBrandLinkedin className="h-4 w-4 text-blue-700" />
                                            </Button>
                                        )}
                                        {candidate.tiktok && (
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-black/5"
                                                onClick={() =>
                                                    openUrl(
                                                        candidate.tiktok!.startsWith('http')
                                                            ? candidate.tiktok!
                                                            : `https://tiktok.com/@${candidate.tiktok}`
                                                    )
                                                }
                                            >
                                                <IconBrandTiktok className="h-4 w-4 text-black" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <Tabs defaultValue="about" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="about"
                                        className="data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-primary dark:data-[state=active]:bg-primary"
                                    >
                                        Manifesto
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="statistics"
                                        className="data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-primary dark:data-[state=active]:bg-primary"
                                    >
                                        Statistics
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="about" className="mt-4">
                                    <div className="space-y-4">
                                        {candidate.manifesto ? (
                                            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                                                {candidate.manifesto}
                                            </p>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">No manifesto available.</p>
                                        )}
                                        {candidate.department && (
                                            <p className="text-sm">
                                                <span className="font-medium">Department:</span> {candidate.department}
                                            </p>
                                        )}
                                        {candidate.structure && (
                                            <p className="text-sm">
                                                <span className="font-medium">Structure:</span> {candidate.structure}
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="statistics" className="mt-4">
                                    <div className="space-y-4">
                                        <p className="text-sm">
                                            <span className="font-medium">Votes:</span> {candidate.votes}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Supporters:</span>{' '}
                                            {candidate.supporters_count ?? 0}
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </section>
                <section className="hidden xl:block w-[26%] bg-background p-4 fixed right-4 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" />
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
        </div>
    );
}
