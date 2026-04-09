const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

// Interface for Candidate data from backend
export interface Candidate {
    id: number;
    candidate_name: string;
    manifesto?: string;
    votes: number;
    supporters: unknown[];
    supporters_count: number;
    department?: string;
    structure?: string;
    profile_picture?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    x?: string;
    threads?: string;
}

// Interface for Candidates API response
export interface GetCandidatesResponse {
    message: string;
    candidates: Candidate[];
    count: number;
}

// Interface for Party data from backend
export interface Party {
    id: number;
    party_name: string;
    manifesto?: string;
    votes: number;
    supporters: unknown[];
    supporters_count: number;
    party_leader?: string;
    structure?: string;
    logo?: string;
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    x?: string;
    threads?: string;
}

// Interface for Parties API response
export interface GetPartiesResponse {
    message: string;
    parties: Party[];
    count: number;
}

export async function fetchAllCandidates(): Promise<Candidate[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-candidates/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data: GetCandidatesResponse = await response.json();
        return data.candidates;
    } catch (error) {
        throw error;
    }
}

export async function fetchAllParties(): Promise<Party[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/somaapp/get-all-parties/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data: GetPartiesResponse = await response.json();

        if (!data.parties || !Array.isArray(data.parties)) {
            throw new Error('Invalid response structure: parties not found or not an array');
        }

        return data.parties;
    } catch (error) {
        throw error;
    }
}

export async function fetchPartyById(id: number): Promise<Party | null> {
    const parties = await fetchAllParties();
    return parties.find((p) => p.id === id) ?? null;
}

export async function fetchCandidateById(id: number): Promise<Candidate | null> {
    const candidates = await fetchAllCandidates();
    return candidates.find((c) => c.id === id) ?? null;
}
