'use client';

import { PopularCouncillorsSection } from '@/components/HomePage/PopularCouncillorsSection';

export default function PopularCouncillorsPage() {
    return (
        <main className="flex-1 bg-backgroundoverflow-y-auto">
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <PopularCouncillorsSection limit={0} />
            </div>
        </main>
    );
}
