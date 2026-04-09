'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Party, fetchAllParties } from '@/lib/soma-api';

function getFilteredParties(parties: Party[], selectedPartyTab: string): Party[] {
    if (selectedPartyTab === 'all') return parties;
    if (selectedPartyTab === 'alice') return parties.filter((p) => p.structure === 'Alice SRC');
    if (selectedPartyTab === 'east-london') return parties.filter((p) => p.structure === 'East London SRC');
    return parties;
}

interface TopPartiesSectionProps {
    limit?: number;
    onPartySelect?: (party: Party) => void;
    className?: string;
}

export function TopPartiesSection({ limit = 10, onPartySelect, className = '' }: TopPartiesSectionProps) {
    const router = useRouter();
    const [parties, setParties] = useState<Party[]>([]);
    const [isLoadingParties, setIsLoadingParties] = useState(true);
    const [partiesError, setPartiesError] = useState<string | null>(null);
    const [selectedPartyTab, setSelectedPartyTab] = useState<string>('all');

    const loadParties = async () => {
        try {
            setIsLoadingParties(true);
            setPartiesError(null);
            const fetched = await fetchAllParties();
            setParties(fetched);
        } catch {
            setPartiesError('Failed to load parties. Please try again later.');
        } finally {
            setIsLoadingParties(false);
        }
    };

    useEffect(() => {
        loadParties();
    }, []);

    const filtered = getFilteredParties(parties, selectedPartyTab);
    const displayList = limit && limit > 0 ? filtered.slice(0, limit) : filtered;

    return (
        <section className={className}>
            <h2 className="text-lg font-semibold mb-4">Top Parties</h2>

            <Tabs value={selectedPartyTab} onValueChange={setSelectedPartyTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="alice" className="text-xs">Alice</TabsTrigger>
                    <TabsTrigger value="east-london" className="text-xs">East London</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-3">
                {isLoadingParties && (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="bg-background rounded-lg p-3 shadow-sm animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {partiesError && (
                    <div className="text-center py-8">
                        <p className="text-red-500 text-sm mb-2">{partiesError}</p>
                        <Button variant="outline" size="sm" onClick={loadParties}>
                            Retry
                        </Button>
                    </div>
                )}

                {!isLoadingParties && !partiesError && filtered.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                        <p className="text-sm">
                            {selectedPartyTab === 'all'
                                ? 'No parties found'
                                : selectedPartyTab === 'alice'
                                  ? 'No Alice SRC parties found'
                                  : 'No East London SRC parties found'}
                        </p>
                    </div>
                )}

                {!isLoadingParties && !partiesError && displayList.length > 0 && (
                    <>
                        {displayList.map((party) => (
                            <motion.div
                                key={party.id}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-background rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => (onPartySelect ? onPartySelect(party) : router.push(`/home/parties/${party.id}`))}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                                                {party.logo ? (
                                                    <Image
                                                        src={party.logo}
                                                        alt={party.party_name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-blue-500 text-xs font-bold">
                                                        {party.party_name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-primary font-semibold truncate max-w-[20ch] text-sm">
                                                    {party.party_name}
                                                </span>
                                                <div>
                                                    <span className="text-sm text-muted-foreground truncate max-w-[25ch] line-clamp-1">
                                                        {party.party_leader || 'Leadership TBA'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </>
                )}
            </div>
        </section>
    );
}
