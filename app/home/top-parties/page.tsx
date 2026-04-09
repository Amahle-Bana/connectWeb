'use client';

import { TopPartiesSection } from '@/components/HomePage/TopPartiesSection';

export default function TopPartiesPage() {
    return (
        <main className="flex-1 bg-background overflow-y-auto">
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <TopPartiesSection limit={0} />
            </div>
        </main>
    );
}
