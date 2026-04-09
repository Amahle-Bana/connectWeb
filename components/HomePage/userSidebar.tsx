import { UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LogOut, Users, Flag, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/auth-context";
import { motion } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";

interface UserSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
    const { logout, isAuthenticated } = useAuth();

    // Current User Redux State
    const currentUser = useAppSelector((state) => state.user);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[100]"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isOpen ? 0 : "-100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed left-0 top-0 h-full w-[300px] bg-background shadow-lg z-[101] flex flex-col"
            >
                {!isAuthenticated ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
                        <h3 className="text-xl font-semibold text-center">Please Login to View Profile</h3>
                        <p className="text-sm text-gray-600 text-center">
                            Create an account or login to access your profile and settings.
                        </p>
                        <Link href="/authentication" className="w-full flex justify-center">
                            <Button 
                                className="w-[160px] bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                                onClick={onClose}
                            >
                                Login to Continue
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                                <UserCircleIcon className="h-8 w-8 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">@{currentUser.username}</span>
                                    <span className="text-xs text-gray-500">{currentUser.email}</span>
                                </div>
                            <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-2 border-b space-y-2">
                                <Link href="/home/popular-councillors" className="flex items-center gap-3 p-2 hover:bg-muted rounded-md">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span>Popular Councillors</span>
                                </Link>
                                <Link href="/home/top-parties" className="flex items-center gap-3 p-2 hover:bg-muted rounded-md">
                                    <Flag className="h-5 w-5 text-primary" />
                                    <span>Top Parties</span>
                                </Link>
                                <Link href="/polls" className="flex items-center gap-3 p-2 hover:bg-muted rounded-md">
                                    <BarChart3 className="h-5 w-5 text-primary" />
                                    <span>Polls</span>
                                </Link>
                            </div>
                        </div>

                        {/* Sign Out Section - Fixed at bottom */}
                        <div className="p-4 border-t mt-auto">
                            <button
                                onClick={async () => {
                                    await logout();
                                    window.location.href = '/authentication';
                                }}
                                className="flex items-center gap-3 p-2 hover:bg-muted rounded-md w-full text-left text-red-600"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </>
    );
} 