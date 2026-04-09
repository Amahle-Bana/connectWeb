import { Maximize2, Minimize2 } from 'lucide-react';

interface MinimizeMaximizeButtonProps {
    isMinimized: boolean;
    onToggle: () => void;
}

export default function MinimizeMaximizeButton({ isMinimized, onToggle }: MinimizeMaximizeButtonProps) {
    return (
        <button 
            onClick={onToggle}
            className="absolute top-2 left-2 p-1 rounded-md hover:bg-gray-100"
        >
            {isMinimized ? (
                <Maximize2 className="w-4 h-4 text-gray-600" />
            ) : (
                <Minimize2 className="w-4 h-4 text-gray-600" />
            )}
        </button>
    );
} 