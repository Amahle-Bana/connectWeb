import { useRef, useState } from 'react';
import { Mic, Play, Pause } from 'lucide-react';
import ArticleAudioDialog from './articleAudioDialog';

// Article Audio Component
interface ArticleAudioProps {
    audioFile: File | null;
    setAudioFile: (file: File | null) => void;
    audioPreview: string | null;
    setAudioPreview: (preview: string | null) => void;
    audioDuration: number;
    setAudioDuration: (duration: number) => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
}

// Article Audio Component
const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Article Audio Component
export default function ArticleAudio({
    audioFile,
    setAudioFile,
    audioPreview,
    setAudioPreview,
    audioDuration,
    setAudioDuration,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying
}: ArticleAudioProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    return (
        <div>
            <label htmlFor="audio" className="block text-sm font-medium text-gray-700 mb-1 font-playfair-display">
                Article Audio
            </label>

            <div 
                className="border-2 border-dashed border-gray-300 hover:border-secondary rounded-md p-1.5 flex flex-col items-center justify-center"
                onClick={() => setIsDialogOpen(true)}
            >
                {!audioPreview ? (
                    <div className="cursor-pointer text-center w-full">
                        <div className="flex flex-col items-center">
                            <div className="flex flex-row">
                                <Mic className="w-6 h-6 text-gray-400 mb-1" />
                                <img src="/sparkles2.png" alt="Sparkles" className="w-6 h-6 cursor-pointer rounded-sm" />
                            </div>
                            <span className="text-xs text-gray-500 font-playfair-display">
                                Click To Upload/Generate Audio
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5 font-playfair-display">
                                MP3, WAV, OGG up to 50MB
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate max-w-[200px]">
                                {audioFile?.name}
                            </span>
                            <button
                                onClick={() => {
                                    setAudioFile(null);
                                    setAudioPreview(null);
                                    setAudioDuration(0);
                                    setCurrentTime(0);
                                    setIsPlaying(false);
                                }}
                                className="text-gray-500 hover:text-gray-700 w-5 h-5 flex items-center justify-center"
                            >
                                ×
                            </button>
                        </div>

                        <audio
                            ref={audioRef}
                            src={audioPreview}
                            onTimeUpdate={() => {
                                if (audioRef.current) {
                                    setCurrentTime(audioRef.current.currentTime);
                                }
                            }}
                            onEnded={() => setIsPlaying(false)}
                            className="hidden"
                        />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (audioRef.current) {
                                        if (isPlaying) {
                                            audioRef.current.pause();
                                        } else {
                                            audioRef.current.play();
                                        }
                                        setIsPlaying(!isPlaying);
                                    }
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <Play className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                            <div className="flex-1 items-center justify-center pb-2">
                                <input
                                    type="range"
                                    min={0}
                                    max={audioDuration}
                                    value={currentTime}
                                    onChange={(e) => {
                                        const time = parseFloat(e.target.value);
                                        if (audioRef.current) {
                                            audioRef.current.currentTime = time;
                                            setCurrentTime(time);
                                        }
                                    }}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <span className="text-xs text-gray-500">
                                {formatTime(currentTime)} / {formatTime(audioDuration)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <ArticleAudioDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                setAudioFile={setAudioFile}
                setAudioPreview={setAudioPreview}
                setAudioDuration={setAudioDuration}
                setCurrentTime={setCurrentTime}
                setIsPlaying={setIsPlaying}
            />
        </div>
    );
} 