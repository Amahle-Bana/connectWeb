import { Dialog2, DialogContent2, DialogHeader2, DialogTitle2 } from "@/components/HomePage/dialog2";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

interface NotificationsDialogProps {
    notificationsModal: boolean;
    setNotificationsModal: (show: boolean) => void;
    activeNotificationCategory: string;
    setActiveNotificationCategory: (category: string) => void;
    notificationCategories: string[];
}

export function NotificationsDialog({
    notificationsModal,
    setNotificationsModal,
    activeNotificationCategory,
    setActiveNotificationCategory,
    notificationCategories
}: NotificationsDialogProps) {
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();

    return (
        <Dialog2
            open={notificationsModal}
            onOpenChange={(open: boolean) => !open && setNotificationsModal(false)}
        >
            <DialogContent2 className="font-comfortaa sm:max-w-[500px] max-w-[380px] rounded-lg h-[600px] flex flex-col">
                
                {/* Create Content Modal Header */}
                <DialogHeader2>
                    <DialogTitle2 className="text-2xl font-bold">Notifications</DialogTitle2>
                </DialogHeader2>

                    <>
                        {/* Categories Container */}
                        <div
                            ref={notificationCategoriesScrollRef}
                            className="flex items-center justify-start space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            {notificationCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveNotificationCategory(category)}
                                    className={`cursor-pointer whitespace-nowrap text-sm font-medium transition-colors ${
                                        activeNotificationCategory === category
                                            ? "text-primary-foreground bg-primary px-4 py-2 rounded-sm"
                                            : "text-primary bg-muted hover:text-primary hover:bg-muted px-4 py-2 rounded-sm"
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
                    </>
            </DialogContent2>
        </Dialog2>
    );
} 