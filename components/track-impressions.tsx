"use client";

import { useEffect } from "react";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/** Fires once per browser session when the app shell mounts — not during build/SSR. */
export function TrackImpressions() {
    useEffect(() => {
        fetch(`${API_BASE}/somaapp/track-impressions/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    return null;
}
