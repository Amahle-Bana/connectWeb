import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

interface Writer {
    name: string;
    publication: string;
    followers: string;
    description: string;
    image: string;
}

interface WriterDetailsSheetProps {
    selectedWriter: Writer | null;
    setSelectedWriter: (writer: Writer | null) => void;
    articles: Array<{
        title: string;
        subtitle: string;
        readTime: string;
        date: string;
        author: string;
    }>;
}

export function WriterDetailsSheet({ selectedWriter, setSelectedWriter, articles }: WriterDetailsSheetProps) {
    return (
        <Sheet
            open={!!selectedWriter}
            onOpenChange={(open) => !open && setSelectedWriter(null)}
        >
            <SheetContent className="w-[400px] sm:w-[540px] rounded-lg m-5 fixed top-0 right-0 h-[95%] font-playfair-display">
                {selectedWriter && (
                    <>
                        {/* Sheet Header */}
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold truncate max-w-[20ch]">
                                {selectedWriter.name}
                            </SheetTitle>
                        </SheetHeader>

                        {/* Sheet Content */}
                        <div className="space-y-4">
                            {/* Sheet Content Image */}
                            <div className="flex items-center gap-4">
                                <div className="mx-4 w-24 h-24 rounded-full overflow-hidden">
                                    <Image
                                        src={selectedWriter.image}
                                        alt={selectedWriter.name}
                                        width={96}
                                        height={96}
                                        className="object-cover"
                                    />
                                </div>

                                {/* Sheet Content Publication & Followers */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-500">
                                        Part Of:
                                    </h3>
                                    <p className="truncate max-w-[25ch]">{selectedWriter.publication}</p>
                                    <p className="text-sm text-gray-500">
                                        {selectedWriter.followers} followers
                                    </p>
                                </div>
                            </div>

                            {/* Sheet Content About */}
                            <div className="m-5">
                                <h4 className="text-sm font-medium text-gray-500">About</h4>
                                <p className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    {selectedWriter.description}
                                </p>
                            </div>

                            {/* Sheet Content Follow Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="mx-5 w-[90%] bg-muted text-blue-600 bg-blue-50 hover:text-blue-700 hover:bg-blue-100 cursor-pointer">
                                Follow
                                <Plus className="h-4 w-4" />
                            </Button>

                            {/* Sheet Content Recent Articles */}
                            <div className="mx-5 mt-4">
                                <h4 className="text-sm font-medium text-primary mb-2">
                                    Parties Supporting:
                                </h4>

                                {/* Sheet Content Recent Articles Mapping */}
                                <div className="h-[200px] overflow-y-auto space-y-3 pr-2">
                                    {articles
                                        .filter(
                                            (article) => article.author === selectedWriter.name
                                        )
                                        .map((article, index) => (
                                            <div key={index} className="bg-background p-3 rounded-lg cursor-pointer">
                                                {/* Sheet Content Recent Articles Title */}
                                                <h5 className="text-primary text-sm font-medium line-clamp-1">
                                                    {article.title}
                                                </h5>

                                                {/* Sheet Content Recent Articles Subtitle */}
                                                <p className="text-xs text-primary mt-1 line-clamp-2">
                                                    {article.subtitle}
                                                </p>

                                                {/* Sheet Content Recent Articles Read Time & Date */}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-primary">
                                                        {article.readTime}
                                                    </span>

                                                    {/* Sheet Content Recent Articles Date */}
                                                    <span className="text-xs text-primary">
                                                        {article.date}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
} 