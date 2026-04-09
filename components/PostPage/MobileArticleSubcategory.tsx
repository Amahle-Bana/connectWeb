import { useRef } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Article Subcategory Component
interface ArticleSubcategoryProps {
    selectedSubcategories: string[];
    setSelectedSubcategories: (subcategories: string[]) => void;
    subcategorySearch: string;
    setSubcategorySearch: (search: string) => void;
    subcategoryInputFocused: boolean;
    setSubcategoryInputFocused: (focused: boolean) => void;
    filteredSubcategories: string[];
    selectedCategories: string[];
}

// Article Subcategory Component
export default function ArticleSubcategory({
    selectedSubcategories,
    setSelectedSubcategories,
    subcategorySearch,
    setSubcategorySearch,
    subcategoryInputFocused,
    setSubcategoryInputFocused,
    filteredSubcategories,
    selectedCategories
}: ArticleSubcategoryProps) {

    // Article Subcategory Component useRef
    const subcategoryInputRef = useRef<HTMLInputElement>(null);

    return (
        // Article Subcategory Component
        <div className="relative">

            {/* Article Subcategories Label and Suggest More Subcategories Button */}
            <div className="flex flex-row justify-between mb-1 pr-7">
                <label htmlFor="subcategories" className="block text-sm font-medium text-gray-700 mb-1- font-playfair-display">
                    Article Subcategories <span className="text-xs text-gray-500">(suggest more subcategories for us <Dialog>
                        <DialogTrigger asChild>
                            <button type="button" className="underline text-blue-500 hover:text-blue-700 bg-transparent p-0 m-0 border-0 inline cursor-pointer">here</button>
                        </DialogTrigger>

                        {/* Suggest More Subcategories Dialog Pop Up */}
                        <DialogContent className="rounded-md">
                            <DialogHeader>
                                <DialogTitle className="font-playfair-display">Suggest More Subcategories For A Specific Category</DialogTitle>
                                <DialogDescription className="font-playfair-display">
                                    {"Let us know what subcategories you'd like to see added."}<span className="text-xs text-red-500 font-playfair-display">(HELP US IMPROVE!)</span>
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={e => { e.preventDefault(); e.stopPropagation(); (document.activeElement as HTMLElement | null)?.blur(); }}>
                                <textarea className="w-full border border-gray-300 rounded-md p-2 mb-4 font-playfair-display" rows={4} placeholder="Submit your subcategory suggestions here..." required />
                                <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-playfair-display">Submit</button>
                                    </DialogClose>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>)</span>
                </label>

                {/* Article Subcategories Selected Subcategories Count */}
                {selectedSubcategories.length > 0 && (
                    <span className="flex items-center h-[25px] px-2 justify-center bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs font-playfair-display">
                        {selectedSubcategories.length}/5
                    </span>
                )}
            </div>

            {/* Article Subcategories Search Input */}
            <div className="flex items-center">
                <Input
                    type="text"
                    id="subcategories"
                    className="w-[95%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-playfair-display"
                    placeholder={selectedCategories.length === 0 ? "Select A 'Article Category' First" : "Search Article Subcategory"}
                    value={subcategorySearch}
                    onChange={e => setSubcategorySearch(e.target.value)}
                    disabled={selectedCategories.length === 0 || selectedSubcategories.length >= 5}
                    autoComplete="off"
                    onFocus={() => setSubcategoryInputFocused(true)}
                    onBlur={() => setTimeout(() => setSubcategoryInputFocused(false), 150)}
                    ref={subcategoryInputRef}
                />
            </div>

            {/* Article Subcategories Search Results */}
            {subcategoryInputFocused && filteredSubcategories.length > 0 && selectedSubcategories.length < 5 && (
                <ul className="absolute z-10 bg-background border border-gray-300 rounded-md mt-1 w-[95%] max-h-40 overflow-auto shadow-lg font-playfair-display">
                    {filteredSubcategories.map((sub) => (
                        <li
                            key={sub}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-playfair-display"
                            onMouseDown={() => {
                                if (selectedSubcategories.length < 5) {
                                    setSelectedSubcategories([...selectedSubcategories, sub]);
                                    setSubcategorySearch("");
                                }
                            }}
                        >
                            {sub}
                        </li>
                    ))}
                </ul>
            )}

            {/* Show selected subcategories as chips */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selectedSubcategories.map((sub) => (
                    <span
                        key={sub}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center text-xs font-playfair-display"
                    >
                        {sub}
                        <button
                            type="button"
                            className="ml-1 text-blue-700 hover:text-blue-900"
                            onClick={() => {
                                setSelectedSubcategories(selectedSubcategories.filter((s) => s !== sub));
                                setSubcategoryInputFocused(false);
                                if (subcategoryInputRef.current) {
                                    subcategoryInputRef.current.blur();
                                }
                            }}
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
} 