import { Dialog2, DialogContent2, DialogHeader2, DialogTitle2 } from "@/components/HomePage/dialog2";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Compass } from "lucide-react";

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
    const { isAuthenticated } = useAuth();

    return (
        <Dialog2
            open={searchQueryModal}
            onOpenChange={(open: boolean) => !open && setSearchQueryModal(false)}
        >
            <DialogContent2 className="sm:max-w-[500px] max-w-[380px] rounded-lg font-playfair-display h-[600px] flex flex-col">
                {/* Create Content Modal Header */}
                <DialogHeader2>
                    <DialogTitle2 className="text-2xl font-bold">Search</DialogTitle2>
                </DialogHeader2>

                {isAuthenticated ? (
                    <>
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
                            <Link href="/home/discovery">
                                <button className="flex flex-row gap-2 items-center justify-center cursor-grab whitespace-nowrap text-sm font-medium transition-colors text-primary bg-muted hover:text-blue-600 hover:bg-muted px-3 py-1.5 rounded-sm">
                                    <Compass className="h-6 w-6 text-primary" /> 
                                    {typeof window !== 'undefined' && window.innerWidth < 600 ? ("") : ("Discover Topics")}
                                </button>
                            </Link>
                            {searchCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveSearchCategory(category)}
                                    className={`cursor-grab whitespace-nowrap text-sm font-medium transition-colors ${
                                        activeSearchCategory === category
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
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
                        <h3 className="text-xl font-semibold text-center">Please Login to Search</h3>
                        <p className="text-sm text-gray-600 text-center">
                            Create an account or login for a more personalized experience.
                        </p>
                        <Link href="/login" className="w-full flex justify-center">
                            <Button 
                                className="w-[160px] bg-secondary text-white hover:bg-secondary/90 cursor-pointer"
                                onClick={() => setSearchQueryModal(false)}
                            >
                                Login to Continue
                            </Button>
                        </Link>
                    </div>
                )}
            </DialogContent2>
        </Dialog2>
    );
} 