'use client';

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, Compass, Mic } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import useWindowSize from "@/hooks/useWindow";
import Image from "next/image";



const searchCategories = ["All", "Writers", "Articles", "Magazines", "Podcasts"];

interface SearchPostMediaItem {
    data?: string;
}

interface SearchPostResult {
    id: number;
    profile_picture?: string;
    username?: string;
    is_anonymous?: boolean;
    created_at: string;
    content: string;
    images?: SearchPostMediaItem[];
    videos?: SearchPostMediaItem[];
    upvotes?: number;
    downvotes?: number;
    comments?: unknown[];
}

export default function SearchPage() {

    const { isAuthenticated } = useAuth();

    const router = useRouter();

    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    const { width } = useWindowSize();

    // Search functionality states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchPostResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Function to search posts
    const searchPosts = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`http://127.0.0.1:8000/somaapp/search-posts/?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data.posts || []);
        } catch (err) {
            console.error('Search error:', err);
            if (err instanceof Error) {
                if (err.message.includes('Failed to fetch')) {
                    setError('Cannot connect to server. Please check if the backend is running.');
                } else if (err.message.includes('HTTP error! status:')) {
                    const statusMatch = err.message.match(/HTTP error! status: (\d+)/);
                    const status = statusMatch ? statusMatch[1] : 'unknown';
                    setError(`Server error (${status}). Please try again later.`);
                } else {
                    setError(`Search failed: ${err.message}`);
                }
            } else {
                setError('Failed to search posts. Please try again.');
            }
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle clicking on a post
    const handlePostClick = (post: SearchPostResult) => {
        router.push(`/post/${post.id}`);
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                searchPosts(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Focus search input on page load
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            <div className="max-w-4xl mx-auto">

                {isAuthenticated ? (
                    <div className="space-y-6">
                        {/* Search Input Section */}

                        <div className=" flex flex-row justify-between align-center w-full">

                            <div className="flex justify-center items-center pr-2">
                                <ChevronLeftIcon className="h-8 w-8 text-primary" onClick={() => router.back()} />
                            </div>
                            
                            <div className="relative flex flex-row justify-center align-center w-full">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border rounded-full focus:outline-none focus:ring-2 focus:ring-secondary text-base"
                                />
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="space-y-4">
                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                    <p className="text-gray-500">Searching...</p>
                                </div>
                            )}

                            {/* No Results */}
                            {!isLoading && !error && searchQuery && searchResults.length === 0 && (
                                <div className="text-center py-12">
                                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">{`No posts found for "${searchQuery}"`}</p>
                                    <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
                                </div>
                            )}

                            {/* Search Results */}
                            {!isLoading && searchResults.length > 0 && (
                                <>
                                    <div className="text-sm text-gray-600">
                                        {`Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                                    </div>
                                    {searchResults.map((post) => (
                                        <div
                                            key={post.id}
                                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => handlePostClick(post)}
                                        >
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-medium overflow-hidden">
                                                    {post.profile_picture ? (
                                                        <Image
                                                            src={post.profile_picture.startsWith('data:')
                                                                ? post.profile_picture
                                                                : `data:image/jpeg;base64,${post.profile_picture}`
                                                            }
                                                            alt={post.username ?? 'User'}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <span className="text-blue-500">
                                                            {(post.username || 'A')[0].toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-base">
                                                        {post.is_anonymous ? 'Anonymous' : post.username}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(post.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed mb-3">
                                                {post.content}
                                            </p>

                                            {/* Media Preview */}
                                            {((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (() => {
                                                const imageUrls: string[] = [];
                                                const videoUrls: string[] = [];

                                                // Extract images
                                                if (post.images) {
                                                    post.images.forEach((imageItem: SearchPostMediaItem) => {
                                                        if (imageItem && imageItem.data && typeof imageItem.data === 'string') {
                                                            const dataUrl = imageItem.data;
                                                            if (dataUrl.startsWith('data:')) {
                                                                const mimeType = dataUrl.split(';')[0].split(':')[1];
                                                                if (mimeType.startsWith('image/')) {
                                                                    imageUrls.push(dataUrl);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }

                                                // Extract videos
                                                if (post.videos) {
                                                    post.videos.forEach((videoItem: SearchPostMediaItem) => {
                                                        if (videoItem && videoItem.data && typeof videoItem.data === 'string') {
                                                            const dataUrl = videoItem.data;
                                                            if (dataUrl.startsWith('data:')) {
                                                                const mimeType = dataUrl.split(';')[0].split(':')[1];
                                                                if (mimeType.startsWith('video/')) {
                                                                    videoUrls.push(dataUrl);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }

                                                const totalMedia = imageUrls.length + videoUrls.length;

                                                return totalMedia > 0 ? (
                                                    <div className="mb-3">
                                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                                            {videoUrls.length > 0 ? (
                                                                <video
                                                                    src={videoUrls[0]}
                                                                    className="w-full h-full object-cover"
                                                                    muted
                                                                    onMouseEnter={(e) => e.currentTarget.play()}
                                                                    onMouseLeave={(e) => e.currentTarget.pause()}
                                                                />
                                                            ) : (
                                                                <Image
                                                                    src={imageUrls[0]}
                                                                    alt="Post media"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            )}
                                                            {totalMedia > 1 && (
                                                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                                                    +{totalMedia - 1} more
                                                                </div>
                                                            )}
                                                            {videoUrls.length > 0 && (
                                                                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                                                    ▶️
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : null;
                                            })()}

                                            {/* Stats */}
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <span>👍</span>
                                                    <span>{post.upvotes || 0}</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <span>👎</span>
                                                    <span>{post.downvotes || 0}</span>
                                                </span>
                                                {post.comments && post.comments.length > 0 && (
                                                    <span className="flex items-center space-x-1">
                                                        <span>💬</span>
                                                        <span>{post.comments.length}</span>
                                                    </span>
                                                )}
                                            </div>
                            </div>
                                    ))}
                                </>
                            )}

                            {/* Empty State */}
                            {!searchQuery && !isLoading && searchResults.length === 0 && (
                                <div className="text-center py-12">
                                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">Start typing to search for posts</p>
                                    <p className="text-gray-400 text-sm mt-2">Search by content or username</p>
                            </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-6 p-8 bg-muted/50 rounded-lg">
                        <h3 className="text-xl md:text-2xl font-semibold text-center">Please Login to Search</h3>
                        <p className="text-sm md:text-base text-gray-600 text-center max-w-md">
                            Create an account or login for a more personalized experience.
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
            </div>
        </div>
    );
}
