import { useRef } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


// Article Category Component
interface ArticleCategoryProps {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    categorySearch: string;
    setCategorySearch: (search: string) => void;
    categoryInputFocused: boolean;
    setCategoryInputFocused: (focused: boolean) => void;
    filteredCategories: string[];
    allCategories: string[];
}

// Article Category Component
export default function ArticleCategory({
    selectedCategories,
    setSelectedCategories,
    categorySearch,
    setCategorySearch,
    categoryInputFocused,
    setCategoryInputFocused,
    filteredCategories,
    allCategories
}: ArticleCategoryProps) {
    // Article Category Component useRef
    const categoryInputRef = useRef<HTMLInputElement>(null);

    return (

        // Article Category Component
        <div className="relative">

            {/* Article Categories Label And Category Count */}
            <div className="flex flex-row justify-between mb-1 pr-7">

                {/* Article Categories Label and Suggest More Categories Button */}
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 font-playfair-display">
                    Article Categories <span className="text-xs text-gray-500">(suggest more categories for us <Dialog>
                        <DialogTrigger asChild>
                            <button type="button" className="underline text-blue-500 hover:text-blue-700 bg-transparent p-0 m-0 border-0 inline cursor-pointer">here</button>
                        </DialogTrigger>

                        {/* Suggest More Categories Dialog Pop Up */}
                        <DialogContent className="rounded-md">
                            <DialogHeader>
                                <DialogTitle className="font-playfair-display">Suggest More Categories</DialogTitle>
                                <DialogDescription className="font-playfair-display">
                                    {"Let us know what categories you'd like to see added."}<span className="text-xs text-red-500">(HELP US IMPROVE!)</span>
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={e => { e.preventDefault(); e.stopPropagation(); (document.activeElement as HTMLElement | null)?.blur(); }}>
                                <textarea className="w-full border border-gray-300 rounded-md p-2 mb-4 font-playfair-display" rows={4} placeholder="Submit your category suggestions here..." required />
                                <div className="flex justify-end gap-2">
                                    <DialogClose asChild>
                                        <button type="submit" className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 font-playfair-display">Submit</button>
                                    </DialogClose>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>)</span>
                </label>


                {/* Article Categories Count */}
                {selectedCategories.length > 0 && (
                    <span className="flex items-center justify-center bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs font-playfair-display">
                        {selectedCategories.length}/5
                    </span>
                )}
            </div>


            {/* Article Categories Search Input */}
            <div className="flex items-center">
                <Input
                    type="text"
                    id="category"
                    className="w-[95%] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-playfair-display"
                    placeholder="Search Article Category"
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    disabled={selectedCategories.length >= 5}
                    autoComplete="off"
                    onFocus={() => setCategoryInputFocused(true)}
                    onBlur={() => setTimeout(() => setCategoryInputFocused(false), 150)}
                    ref={categoryInputRef}
                />
            </div>

            {/* Article Categories Search Results */}
            {categoryInputFocused && filteredCategories.length > 0 && selectedCategories.length < 5 && (
                <ul className="absolute z-10 bg-background border border-gray-300 rounded-md mt-1 w-[95%] max-h-40 overflow-auto shadow-lg">
                    {filteredCategories.map((cat) => (
                        <li
                            key={cat}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-playfair-display"
                            onMouseDown={() => {
                                if (selectedCategories.length < 5) {
                                    setSelectedCategories([...selectedCategories, cat]);
                                    setCategorySearch("");
                                }
                            }}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            )}

            {/* Show selected categories as chips */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selectedCategories.map((cat) => (
                    <span
                        key={cat}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center text-xs font-playfair-display"
                    >
                        {cat}
                        <button
                            type="button"
                            className="ml-1 text-blue-700 hover:text-blue-900"
                            onClick={() => {
                                setSelectedCategories(selectedCategories.filter((c) => c !== cat));
                                setCategoryInputFocused(false);
                                if (categoryInputRef.current) {
                                    categoryInputRef.current.blur();
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