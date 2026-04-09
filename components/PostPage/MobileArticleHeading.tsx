import { Copy, Check, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from 'react';
import ArticleHeadingDialog from './MobileArticleHeadingDialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Article Heading Component
interface ArticleHeadingProps {
    heading: string;
    setHeading: (heading: string) => void;
    isHeadingCopied: boolean;
    setIsHeadingCopied: (isCopied: boolean) => void;
}

// Article Heading Component
export default function ArticleHeading({ 
    heading, 
    setHeading, 
    isHeadingCopied, 
    setIsHeadingCopied 
}: ArticleHeadingProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Article Heading Component
    return (
        <div>
            <ArticleHeadingDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                setAudioFile={() => {}}
                setAudioPreview={() => {}}
                setAudioDuration={() => {}}
                setCurrentTime={() => {}}
                setIsPlaying={() => {}}
            />

            {/* Article Heading Label and Character Count */}
            <div className="flex pr-5">
                <div className="flex flex-row align-center justify-between w-[92%]">
                    <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1 font-playfair-display">
                        Article Heading
                    </label>
                    <div className="text-xs text-gray-500 mt-1 text-right font-playfair-display">
                        {heading.length}/120 characters
                    </div>
                </div>
            </div>

            {/* Article Description Input */}
            <div className="flex items-center gap-1">
                <div className="relative flex w-[90%]">
                    <Input
                        type="text"
                        id="description"
                        className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-playfair-display"
                        placeholder="Enter/Generate Article Heading..."
                        value={heading}
                        onChange={e => {
                            if (e.target.value.length <= 120) setHeading(e.target.value);
                        }}
                        maxLength={120}
                    />
                    {heading.length >= 3 && (
                        <X 
                            className="absolute right-9 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 cursor-pointer hover:text-blue-500"
                            onClick={() => setHeading('')}
                        />
                    )}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(heading);
                                        setIsHeadingCopied(true);
                                        setTimeout(() => setIsHeadingCopied(false), 2000);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 hover:text-blue-700 transition-colors bg-background hover:bg-blue-50 group"
                                >
                                    {isHeadingCopied ? (
                                        <Check className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />    
                                    ) : (
                                        <Copy className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-background text-secondary border border-secondary rounded-lg px-2 py-1 text-xs font-playfair-display">
                                {isHeadingCopied ? "Copied!" : "Copy Description"}
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
                        <TooltipContent className="bg-background text-secondary border border-secondary rounded-lg px-2 py-1 text-xs font-playfair-display">
                            Ask Soma AI
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
} 