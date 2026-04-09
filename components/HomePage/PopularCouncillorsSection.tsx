'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Candidate, fetchAllCandidates } from '@/lib/soma-api';

function getFilteredCandidates(candidates: Candidate[], selectedTab: string): Candidate[] {
    if (selectedTab === 'all') return candidates;
    if (selectedTab === 'alice') return candidates.filter((c) => c.structure === 'Alice SRC');
    if (selectedTab === 'east-london') return candidates.filter((c) => c.structure === 'East London SRC');
    return candidates;
}

interface PopularCouncillorsSectionProps {
    limit?: number;
    className?: string;
}

export function PopularCouncillorsSection({ limit = 10, className = '' }: PopularCouncillorsSectionProps) {
    const router = useRouter();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
    const [candidatesError, setCandidatesError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>('all');

    const loadCandidates = async () => {
        try {
            setIsLoadingCandidates(true);
            setCandidatesError(null);
            const fetched = await fetchAllCandidates();
            setCandidates(fetched);
        } catch {
            setCandidatesError('Failed to load candidates. Please try again later.');
        } finally {
            setIsLoadingCandidates(false);
        }
    };

    useEffect(() => {
        loadCandidates();
    }, []);

    const filtered = getFilteredCandidates(candidates, selectedTab);
    const displayList = limit && limit > 0 ? filtered.slice(0, limit) : filtered;

    return (
        <section className={className}>
            <h2 className="text-lg font-semibold mb-4">Popular Councillors</h2>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="alice" className="text-xs">Alice</TabsTrigger>
                    <TabsTrigger value="east-london" className="text-xs">East London</TabsTrigger>
                </TabsList>
            </Tabs>

            {isLoadingCandidates && (
                <div className="space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="bg-background rounded-lg p-3 shadow-sm animate-pulse">
                            <div className="flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                                        <div className="h-4 bg-gray-300 rounded w-24" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="h-3 bg-gray-300 rounded w-20" />
                                    <div className="h-7 bg-gray-300 rounded w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {candidatesError && (
                <div className="text-center py-8">
                    <p className="text-red-500 text-sm mb-2">{candidatesError}</p>
                    <Button variant="outline" size="sm" onClick={loadCandidates}>
                        Retry
                    </Button>
                </div>
            )}

            {!isLoadingCandidates && !candidatesError && (
                <div className="space-y-3">
                    {filtered.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground text-sm">
                                {selectedTab === 'all'
                                    ? 'No Candidates found'
                                    : selectedTab === 'alice'
                                      ? 'No Alice SRC candidates found'
                                      : 'No East London SRC candidates found'}
                            </p>
                        </div>
                    ) : (
                        displayList.map((candidate) => (
                            <motion.div
                                key={candidate.id}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-background rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/home/popular-councillors/${candidate.id}`)}
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                {candidate.profile_picture ? (
                                                    <Image
                                                        src={candidate.profile_picture}
                                                        alt={candidate.candidate_name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 font-semibold text-lg">
                                                        {candidate.candidate_name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-base font-semibold text-primary truncate max-w-[15ch]">
                                                {candidate.candidate_name}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-600">
                                            {candidate.votes} votes
                                        </div>
                                    </div>
                                    <div className="flex flex-col mt-1">
                                        <span className="text-sm text-muted-foreground truncate max-w-[20ch]">
                                            {candidate.manifesto
                                                ? candidate.manifesto.slice(0, 30) + (candidate.manifesto.length > 30 ? '...' : '')
                                                : 'No manifesto available'}
                                        </span>
                                        {candidate.department && (
                                            <span className="text-xs text-muted-foreground mt-1">
                                                {candidate.department}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </section>
    );
}
