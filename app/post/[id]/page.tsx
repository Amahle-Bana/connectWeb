"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, ArrowBigUp, ArrowBigDown, MoreVertical, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
// import { Textarea } from "@/components/ui/textarea"; // Not available, using native textarea
import { useAuth } from "@/context/auth-context";
import Image from 'next/image';

interface MediaDataItem {
    data?: string;
}

interface Post {
    id: number;
    content: string;
    images: (string | MediaDataItem)[];
    videos: (string | MediaDataItem)[];
    is_anonymous: boolean;
    user: {
        id: number;
        username: string;
        full_name?: string;
        profile_picture?: string;
    };
    user_data: {
        username: string;
        email: string;
        fullName?: string;
        profilePicture?: string;
    };
    created_at: string;
    updated_at: string;
    upvotes: number;
    downvotes: number;
    comments: PostComment[];
}

interface PostComment {
    id: string;
    user_id: number;
    username: string;
    full_name?: string;
    profile_picture?: string;
    text: string;
    timestamp: string;
    created_at: string;
}

export default function PostDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, username } = useAuth();
    const postId = params.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Voting states
    const [votingState, setVotingState] = useState<'upvoted' | 'downvoted' | null>(null);
    const [votingLoading, setVotingLoading] = useState(false);

    // Comment drawer state
    const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);

    // Fetch post details
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8000/somaapp/get-all-posts/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await response.json();
                const foundPost = data.posts.find((p: Post) => p.id.toString() === postId);

                if (!foundPost) {
                    setError('Post not found');
                } else {
                    setPost(foundPost);
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    // Handle upvoting
    const handleUpvote = async () => {
        if (!post || votingLoading) return;

        try {
            console.log('👍 Upvoting post:', post.id);

            // Set loading state
            setVotingLoading(true);

            // Update local voting state immediately for better UX
            setVotingState(prev => prev === 'upvoted' ? null : 'upvoted');

            // Make API call to update database
            const response = await fetch(`http://127.0.0.1:8000/somaapp/upvote-post/${post.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to upvote');
            }

            const data = await response.json();

            // Update the post with new vote counts
            setPost(prev => prev ? {
                ...prev,
                upvotes: data.new_upvotes || prev.upvotes,
                downvotes: data.new_downvotes || prev.downvotes
            } : null);

            console.log('✅ Upvote updated successfully:', data);

        } catch (error) {
            console.error('❌ Error upvoting post:', error);
            // Revert local state on error
            setVotingState(prev => prev === 'upvoted' ? null : 'upvoted');
        } finally {
            // Clear loading state
            setVotingLoading(false);
        }
    };

    // Handle downvoting
    const handleDownvote = async () => {
        if (!post || votingLoading) return;

        try {
            console.log('👎 Downvoting post:', post.id);

            // Set loading state
            setVotingLoading(true);

            // Update local voting state immediately for better UX
            setVotingState(prev => prev === 'downvoted' ? null : 'downvoted');

            // Make API call to update database
            const response = await fetch(`http://127.0.0.1:8000/somaapp/downvote-post/${post.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to downvote');
            }

            const data = await response.json();

            // Update the post with new vote counts
            setPost(prev => prev ? {
                ...prev,
                upvotes: data.new_upvotes || prev.upvotes,
                downvotes: data.new_downvotes || prev.downvotes
            } : null);

            console.log('✅ Downvote updated successfully:', data);

        } catch (error) {
            console.error('❌ Error downvoting post:', error);
            // Revert local state on error
            setVotingState(prev => prev === 'downvoted' ? null : 'downvoted');
        } finally {
            // Clear loading state
            setVotingLoading(false);
        }
    };

    // Handle comment button click
    const handleComment = () => {
        console.log('💬 Opening comment drawer for post:', post?.id);
        setCommentDrawerOpen(true);
    };

    // Handle submitting comment
    const handleSubmitComment = async () => {
        if (!commentText.trim() || !post) return;

        console.log('💬 Submitting comment:', {
            postId: post.id,
            comment: commentText.trim()
        });

        setSubmittingComment(true);

        try {
            const apiUrl = `http://127.0.0.1:8000/somaapp/comment-post/${post.id}/`;
            console.log('🌐 Making comment API request to:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment: commentText.trim()
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Comment submitted successfully:', data);

                // Update post with new comment
                if (data.comment) {
                    setPost(prev => prev ? {
                        ...prev,
                        comments: [...(prev.comments || []), data.comment]
                    } : null);
                }

                // Clear the comment input
                setCommentText('');

                console.log('Comment added successfully!');
            } else {
                console.error('❌ HTTP Error:', response.status, response.statusText);
                const responseText = await response.text();
                console.error('❌ Response body:', responseText);
            }
        } catch (error) {
            console.error('❌ Error submitting comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        {error || 'Post not found'}
                    </h1>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">Post Details</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Post Content */}
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-12 h-12">
                                        {post.is_anonymous ? (
                                            <AvatarFallback className="bg-secondary">
                                                <User className="w-6 h-6" />
                                            </AvatarFallback>
                                        ) : post.user_data?.profilePicture ? (
                                            <AvatarImage
                                                src={post.user_data.profilePicture.startsWith('data:')
                                                    ? post.user_data.profilePicture
                                                    : `data:image/jpeg;base64,${post.user_data.profilePicture}`
                                                }
                                                alt={post.user_data.fullName || post.user_data.username}
                                            />
                                        ) : (
                                            <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                                {(post.user_data?.fullName || post.user_data?.username || 'U').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-semibold text-lg">
                                                {post.is_anonymous ? 'Anonymous' : (post.user_data?.fullName || post.user_data?.username)}
                                            </h2>
                                            <span className="text-sm text-muted-foreground">
                                                @{post.is_anonymous ? 'anonymous' : post.user_data?.username}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                        {post.content}
                                    </p>
                                </div>

                                {/* Images */}
                                {post.images && post.images.length > 0 && (() => {
                                    // Extract image data URLs from image objects
                                    const imageUrls: string[] = [];

                                    post.images.forEach((imageItem: MediaDataItem | string) => {
                                        if (
                                            typeof imageItem === 'object' &&
                                            imageItem !== null &&
                                            'data' in imageItem &&
                                            imageItem.data &&
                                            typeof imageItem.data === 'string'
                                        ) {
                                            const dataUrl = imageItem.data;
                                            // Check if it's a valid data URL
                                            if (dataUrl.startsWith('data:')) {
                                                const mimeType = dataUrl.split(';')[0].split(':')[1];
                                                if (mimeType.startsWith('image/')) {
                                                    imageUrls.push(dataUrl);
                                                }
                                            }
                                        }
                                    });

                                    return imageUrls.length > 0 ? (
                                        <div className="mt-4 grid grid-cols-1 gap-4">
                                            {imageUrls.map((imageUrl, index) => (
                                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Post image ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : null;
                                })()}

                                {/* Videos */}
                                {post.videos && post.videos.length > 0 && (() => {
                                    // Extract video data URLs from video objects
                                    const videoUrls: string[] = [];

                                    post.videos.forEach((videoItem: MediaDataItem | string) => {
                                        if (
                                            typeof videoItem === 'object' &&
                                            videoItem !== null &&
                                            'data' in videoItem &&
                                            videoItem.data &&
                                            typeof videoItem.data === 'string'
                                        ) {
                                            const dataUrl = videoItem.data;
                                            // Check if it's a valid data URL
                                            if (dataUrl.startsWith('data:')) {
                                                const mimeType = dataUrl.split(';')[0].split(':')[1];
                                                if (mimeType.startsWith('video/')) {
                                                    videoUrls.push(dataUrl);
                                                }
                                            }
                                        }
                                    });

                                    return videoUrls.length > 0 ? (
                                        <div className="mt-4 grid grid-cols-1 gap-4">
                                            {videoUrls.map((videoUrl, index) => (
                                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                                                    <video
                                                        src={videoUrl}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : null;
                                })()}

                                {/* Actions */}
                                <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                                    <button
                                        className={`flex items-center gap-1 transition-all duration-200 p-1 rounded ${
                                            votingState === 'upvoted'
                                                ? 'text-green-600 bg-green-100'
                                                : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                                        } ${votingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleUpvote}
                                        title="Upvote"
                                        disabled={votingLoading}
                                    >
                                        <ArrowBigUp className={`w-4 h-4 ${votingLoading ? 'animate-pulse' : ''}`} />
                                        <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">{post.upvotes || 0}</span>
                                    </button>
                                    <button
                                        className={`flex items-center gap-1 transition-all duration-200 p-1 rounded ${
                                            votingState === 'downvoted'
                                                ? 'text-red-600 bg-red-100'
                                                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                                        } ${votingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={handleDownvote}
                                        title="Downvote"
                                        disabled={votingLoading}
                                    >
                                        <ArrowBigDown className={`w-4 h-4 ${votingLoading ? 'animate-pulse' : ''}`} />
                                        <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">{post.downvotes || 0}</span>
                                    </button>
                                    <button
                                        className="flex items-center gap-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 p-1 rounded"
                                        onClick={handleComment}
                                        title="Comment"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium text-gray-700">{post.comments?.length || 0}</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold">Post Info</h3>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Upvotes</span>
                                    <span>{post.upvotes || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Downvotes</span>
                                    <span>{post.downvotes || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Comments</span>
                                    <span>{post.comments?.length || 0}</span>
                                </div>
                                {post.is_anonymous && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Privacy</span>
                                        <span>Anonymous</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Related Posts or Author Info could go here */}
                        {!post.is_anonymous && (
                            <Card>
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">Author</h3>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10">
                                            {post.user_data?.profilePicture ? (
                                                <AvatarImage
                                                    src={post.user_data.profilePicture.startsWith('data:')
                                                        ? post.user_data.profilePicture
                                                        : `data:image/jpeg;base64,${post.user_data.profilePicture}`
                                                    }
                                                    alt={post.user_data.fullName || post.user_data.username}
                                                />
                                            ) : (
                                                <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                                    {(post.user_data?.fullName || post.user_data?.username || 'U').charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {post.user_data?.fullName || post.user_data?.username}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                @{post.user_data?.username}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Comment Drawer */}
            <Drawer open={commentDrawerOpen} onOpenChange={(open) => {
                setCommentDrawerOpen(open);
                if (!open) {
                    setCommentText('');
                }
            }}>
                <DrawerContent className="h-[100vh] max-h-[100vh]">
                    <div className="mx-auto w-full max-w-2xl h-full flex flex-col">
                        <DrawerHeader>
                            <DrawerTitle>Comments</DrawerTitle>
                            <DrawerDescription>
                                {post ? (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-50 dark:bg-blue-900/20">
                                            {post.is_anonymous ? (
                                                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-semibold text-sm">
                                                    ?
                                                </div>
                                            ) : post.user_data?.profilePicture ? (
                                                <Image
                                                    src={post.user_data.profilePicture.startsWith('data:')
                                                        ? post.user_data.profilePicture
                                                        : `data:image/jpeg;base64,${post.user_data.profilePicture}`
                                                    }
                                                    alt={post.user_data.fullName || post.user_data.username}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-blue-500 font-semibold text-sm">
                                                    {(post.user_data?.fullName || post.user_data?.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-primary">
                                                {post.is_anonymous ? 'Anonymous' : (post.user_data?.fullName || post.user_data?.username)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {post.content.length > 50
                                                    ? post.content.substring(0, 50) + '...'
                                                    : post.content
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    'View and add comments to this post'
                                )}
                            </DrawerDescription>
                        </DrawerHeader>

                        <div className="p-4 pb-0 flex-1 flex flex-col min-h-0">
                            {/* Comments List */}
                            <div className="space-y-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 min-h-0 pr-2 scroll-smooth">
                                {post?.comments && post.comments.length > 0 ? (
                                    post.comments.map((comment: PostComment, index: number) => (
                                        <div key={comment.id || index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Avatar className="w-8 h-8">
                                                {comment.profile_picture ? (
                                                    <Image
                                                        src={comment.profile_picture.startsWith('data:')
                                                            ? comment.profile_picture
                                                            : `data:image/jpeg;base64,${comment.profile_picture}`
                                                        }
                                                        alt={comment.full_name || comment.username || 'User'}
                                                        width={32}
                                                        height={32}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                                        {(comment.full_name || comment.username || 'U').charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-primary">
                                                        {comment.full_name || comment.username || 'Anonymous'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No comments yet</p>
                                        <p className="text-xs text-gray-400">Be the first to comment!</p>
                                    </div>
                                )}
                            </div>

                            {/* Add Comment Form */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg flex-shrink-0 border-t">
                                {isAuthenticated ? (
                                    <div className="flex gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                                {username ? username.charAt(0).toUpperCase() : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <textarea
                                                placeholder="Write a comment..."
                                                value={commentText}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                                                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={3}
                                            />
                                            <div className="flex justify-end mt-3">
                                                <Button
                                                    size="sm"
                                                    onClick={handleSubmitComment}
                                                    disabled={!commentText.trim() || submittingComment}
                                                    className="px-4"
                                                >
                                                    {submittingComment ? 'Posting...' : 'Post Comment'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-600 mb-3">
                                            Please log in to comment on this post
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.push('/authentication/login')}
                                        >
                                            Log In to Comment
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DrawerFooter className="flex-shrink-0">
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
