import { Dialog4, DialogContent4, DialogHeader4, DialogTitle4 } from "./dialog4";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef } from "react";

interface NotificationsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isAuthenticated: boolean;
    activeNotificationCategory: string;
    setActiveNotificationCategory: (category: string) => void;
    notificationCategories: string[];
}

export function NotificationsDialog({
    open,
    onOpenChange,
    isAuthenticated,
    activeNotificationCategory,
    setActiveNotificationCategory,
    notificationCategories
}: NotificationsDialogProps) {
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    return (
        <Dialog4
            open={open}
            onOpenChange={(open: boolean) => !open && onOpenChange(false)}
        >
            <DialogContent4 className="sm:max-w-[500px] max-w-[380px] rounded-lg font-playfair-display h-[600px] flex flex-col">
                <DialogHeader4>
                    <DialogTitle4 className="text-2xl font-bold">Notifications</DialogTitle4>
                </DialogHeader4>

                {!isAuthenticated ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
                        <h3 className="text-xl font-semibold text-center">Please Login to View Notifications</h3>
                        <p className="text-sm text-gray-600 text-center">
                            Create an account or login to view your notifications.
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
                    <>
                        <div
                            ref={notificationCategoriesScrollRef}
                            className="flex items-center justify-start space-x-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        >
                            {notificationCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveNotificationCategory(category)}
                                    className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${
                                        activeNotificationCategory === category
                                            ? "text-blue-600 bg-blue-50 px-4 py-2 rounded-sm"
                                            : "text-primary bg-muted hover:text-blue-600 hover:bg-muted px-4 py-2 rounded-sm"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="space-y-4">
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
                )}
            </DialogContent4>
        </Dialog4>
    );
} 