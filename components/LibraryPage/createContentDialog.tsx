import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pen, Mic, Book } from "lucide-react";
import Link from "next/link";

interface CreateContentDialogProps {
    showCreateModal: boolean;
    setShowCreateModal: (show: boolean) => void;
}

export function CreateContentDialog({ showCreateModal, setShowCreateModal }: CreateContentDialogProps) {
    return (
        <Dialog
            open={showCreateModal}
            onOpenChange={(open: boolean) => !open && setShowCreateModal(false)}
        >
            <DialogContent className="sm:max-w-[500px] max-w-[380px] rounded-lg font-playfair-display">
                {/* Create Content Modal Header */}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{"What's On Your Mind?"}</DialogTitle>
                </DialogHeader>

                {/* Create Content Modal Buttons */}
                <div className="flex flex-col gap-3">
                    <Link href="/post">
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg flex items-center justify-between gap-3 bg-secondary hover:bg-secondary/70 text-primary rounded-lg"
                            onClick={() => setShowCreateModal(false)}
                        >
                            <div className="flex items-center gap-3 text-white">
                                <Pen className="h-6 w-6 text-white" />
                                I Want To Write An Article
                            </div>
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </Link>

                    <Link href="/post/podcast">
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg flex items-center justify-between gap-3 bg-secondary hover:bg-secondary/70 text-primary rounded-lg"
                            onClick={() => setShowCreateModal(false)}
                        >
                            <div className="flex items-center gap-3 text-white">
                                <Mic className="h-6 w-6 text-white" />
                                I Want To Create A Podcast
                            </div>
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </Link>

                    <Link href="/post/magazine">
                        <Button
                            size="lg"
                            className="w-full h-14 text-lg flex items-center justify-between gap-3 bg-secondary hover:bg-secondary/70 text-primary rounded-lg"
                            onClick={() => setShowCreateModal(false)}
                        >
                            <div className="flex items-center gap-3 text-white">
                                <Book className="h-6 w-6 text-white" />
                                I Want To Create A Magazine
                            </div>
                            <Plus className="h-6 w-6 text-white" />
                        </Button>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
} 