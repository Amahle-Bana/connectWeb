import { Image as ImageIcon } from 'lucide-react';
import ArticleImageDialog from './articleImageDialog';
import { useState } from 'react';

// Article Image Component
interface ArticleImageProps {
    imagePreview: string | null;
    setImagePreview: (preview: string | null) => void;
}

// Article Image Component
export default function ArticleImage({
    imagePreview,
    setImagePreview
}: ArticleImageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            {/* Article Image Label */}
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1 font-playfair-display">
                Article Image
            </label>

            {/* Article Image Input */}
            <div 
                className="border-2 border-dashed border-gray-300 hover:border-secondary rounded-md p-1.5 h-49 flex flex-col items-center justify-center mb-1 pointer relative"
                onClick={() => setIsDialogOpen(true)}
            >
                <div className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="object-contain max-h-58 max-w-full rounded-md"
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="flex flex-row">
                                <ImageIcon className="w-6 h-6 text-gray-400 mb-1 " />
                                <img src="/sparkles2.png" alt="" className="w-6 h-6 cursor-pointer rounded-sm" />
                            </div>
                            <span className="text-xs text-gray-500 font-playfair-display">
                                Click To Upload/Generate Image
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5 font-playfair-display">
                                PNG, JPG, GIF up to 10MB
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <ArticleImageDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                setImagePreview={setImagePreview}
            />
        </div>
    );
} 