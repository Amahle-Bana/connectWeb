import { Copy, Check, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from 'react';
import ArticleDescriptionDialog from './articleDescriptionDialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ArticleDescriptionProps {
    description: string;
    setDescription: (description: string) => void;
    isDescriptionCopied: boolean;
    setIsDescriptionCopied: (isCopied: boolean) => void;
}

// Article Description Component
export default function ArticleDescription({ 
    description, 
    setDescription, 
    isDescriptionCopied, 
    setIsDescriptionCopied 
}: ArticleDescriptionProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>

            {/* Article Description Label and Character Count */}
            <div className="flex flex-row justify-between pr-5 font-playfair-display">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 font-playfair-display">
                    Article Description
                </label>
                <div className="text-xs text-gray-500 mt-1 mr-10 text-right font-playfair-display">
                    {description.length}/140 characters
                </div>
            </div>

            {/* Article Description Input */}
            <div className="flex items-center gap-1">
                <div className="relative flex w-[90%]">
                    <Input
                        type="text"
                        id="description"
                        className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-playfair-display"
                        placeholder="Enter/Generate Article Description..."
                        value={description}
                        onChange={e => {
                            if (e.target.value.length <= 140) setDescription(e.target.value);
                        }}
                        maxLength={140}
                    />

                    
                    {description.length >= 3 && (
                        <X 
                            className="absolute right-9 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-500"
                            onClick={() => setDescription('')}
                        />
                    )}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(description);
                                        setIsDescriptionCopied(true);
                                        setTimeout(() => setIsDescriptionCopied(false), 2000);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors bg-background hover:bg-blue-50 group"
                                >
                                    {isDescriptionCopied ? (
                                        <Check className="w-5 h-5 group-hover:text-blue-500" />    
                                    ) : (
                                        <Copy className="w-5 h-5 group-hover:text-blue-500" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-background text-secondary border border-secondary rounded-lg px-2 py-1 text-xs">
                                {isDescriptionCopied ? "Copied!" : "Copy Description"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* SOMA AI Image */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <img 
                                src="/sparkles2.png" 
                                alt="Sparkles" 
                                className="w-7 h-7 cursor-pointer rounded-sm hover:bg-muted" 
                                onClick={() => setIsDialogOpen(true)}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-background text-secondary border border-secondary rounded-lg px-2 py-1 text-xs">
                            Ask Soma AI
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <ArticleDescriptionDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onDescriptionGenerated={(newDescription) => setDescription(newDescription)}
            />
        </div>
    );
} 