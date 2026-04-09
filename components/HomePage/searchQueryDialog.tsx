import { Dialog2, DialogContent2, DialogHeader2, DialogTitle2 } from "@/components/HomePage/dialog2";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Compass } from "lucide-react";

interface SearchPostResult {
    id: string | number;
    profile_picture?: string;
    username?: string;
    is_anonymous?: boolean;
    created_at: string;
    content: string;
    upvotes?: number;
    downvotes?: number;
    comments?: unknown[];
}

interface SearchQueryDialogProps {
    searchQueryModal: boolean;
    setSearchQueryModal: (show: boolean) => void;
    activeSearchCategory: string;
    setActiveSearchCategory: (category: string) => void;
    searchCategories: string[];
}

export function SearchQueryDialog({
    searchQueryModal,
    setSearchQueryModal,
    activeSearchCategory,
    setActiveSearchCategory,
    searchCategories
}: SearchQueryDialogProps) {
    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchPostResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
        // Close the search modal
        setSearchQueryModal(false);
        // Navigate to the post details page
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

    // Clear search when modal closes
    useEffect(() => {
        if (!searchQueryModal) {
            setSearchQuery("");
            setSearchResults([]);
            setError("");
        }
    }, [searchQueryModal]);

    return (
        <Dialog2
            open={searchQueryModal}
            onOpenChange={(open: boolean) => !open && setSearchQueryModal(false)}
        >
            <DialogContent2 className="font-comfortaa sm:max-w-[500px] max-w-[380px] rounded-lg h-[600px] flex flex-col">
                {/* Create Content Modal Header */}
                <DialogHeader2>
                    <DialogTitle2 className="text-2xl font-bold">Search</DialogTitle2>
                </DialogHeader2>
                    <>
                        {/* Search Input Section */}
                        <div className="relative mt-1">
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>

                        {/* Results Section */}
                        <div className="flex-1 overflow-y-auto">
                            {error && (
                                <div className="p-3 text-red-600 text-center">
                                    {error}
                                </div>
                            )}

                            {isLoading && (
                                <div className="p-3 text-center text-gray-500">
                                    Searching...
                                </div>
                            )}

                            {!isLoading && !error && searchQuery && searchResults.length === 0 && (
                                <div className="p-3 text-center text-gray-500">
                                    {`No posts found for "${searchQuery}"`}
                                </div>
                            )}

                            {!isLoading && searchResults.length > 0 && (
                                <div className="space-y-4">
                                    <div className="text-sm text-gray-600 px-3">
                                        {`Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
                                    </div>
                                    {searchResults.map((post) => (
                                        <div
                                            key={post.id}
                                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => handlePostClick(post)}
                                        >
                                            <div className="flex items-center space-x-2 mb-2">
                                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-medium text-blue-500">
                                                    {post.profile_picture ? (
                                                        <img
                                                            src={post.profile_picture}
                                                            alt={post.username}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        (post.username || 'A')[0].toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm">
                                                        {post.is_anonymous ? 'Anonymous' : post.username}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 line-clamp-3">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                                <span>👍 {post.upvotes || 0}</span>
                                                <span>👎 {post.downvotes || 0}</span>
                                                {post.comments && post.comments.length > 0 && (
                                                    <span>💬 {post.comments.length}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
            </DialogContent2>
        </Dialog2>
    );
} 