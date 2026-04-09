import { useState, useEffect } from 'react';

export const useScreenSize = () => {
    const [isMedium, setIsMedium] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            const w = window.innerWidth;
            setIsMedium(w <= 1440);
            setIsSmall(w <= 700);
            setIsMobile(w < 768);
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { isSmall, isMedium, isMobile };
}; 