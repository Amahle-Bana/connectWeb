import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"

export type PodcastsPublicationSummary = {
    name: string
    icon: string
    author: string
    Subscribers: string | number
    description: string
}

interface PodcastsArticlePreview {
    title: string
    subtitle: string
    publisher: { name: string }
    readTime?: string
    date?: string
}

interface PublicationDetailsSheetProps {
    selectedPublication: PodcastsPublicationSummary | null
    setSelectedPublication: (publication: PodcastsPublicationSummary | null) => void
    articles: PodcastsArticlePreview[]
}

const PublicationDetailsSheet = ({ selectedPublication, setSelectedPublication, articles }: PublicationDetailsSheetProps) => {
    return (
        <Sheet open={!!selectedPublication} onOpenChange={(open) => !open && setSelectedPublication(null)}>
            <SheetContent className="w-[400px] sm:w-[540px] rounded-lg m-5 fixed top-0 right-0 h-[95%]">
                {selectedPublication && (
                    <>
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold">
                                {selectedPublication.name}
                            </SheetTitle>
                        </SheetHeader>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="mx-4 w-24 h-24 rounded-full overflow-hidden">
                                    <Image
                                        src={selectedPublication.icon}
                                        alt={selectedPublication.name}
                                        width={96}
                                        height={96}
                                        className="object-cover"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-500">
                                        Author:
                                    </h3>
                                    <p>{selectedPublication.author}</p>
                                    <p className="text-sm text-gray-500">
                                        {selectedPublication.Subscribers} Subscribers
                                    </p>
                                </div>
                            </div>

                            <div className="m-5">
                                <h4 className="text-sm font-medium text-gray-500">About</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                    {selectedPublication.description}
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="mx-5 w-[90%] bg-muted text-blue-600 bg-blue-50 hover:text-blue-700 hover:bg-blue-100 cursor-pointer">
                                Subscribe
                                <Plus className="h-4 w-4" />
                            </Button>

                            <div className="mx-5 mt-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                    Recent Articles
                                </h4>

                                <div className="h-[200px] overflow-y-auto space-y-3 pr-2">
                                    {articles
                                        .filter(
                                            (article) =>
                                                article.publisher.name === selectedPublication.name
                                        )
                                        .map((article, index) => (
                                            <div key={index} className="bg-secondary p-3 rounded-lg cursor-pointer">
                                                <h5 className="text-sm font-medium line-clamp-1 text-white">
                                                    {article.title}
                                                </h5>

                                                <p className="text-xs text-primary mt-1 line-clamp-2 text-white">
                                                    {article.subtitle}
                                                </p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-primary text-white">
                                                        {article.readTime}
                                                    </span>
                                                    <span className="text-xs text-primary text-white">
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
    )
}

export default PublicationDetailsSheet 