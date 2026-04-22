"use client";

import { useEffect } from "react";
import { API_BASE_URL } from "@/lib/api-config";

/** Fires once per browser session when the app shell mounts — not during build/SSR. */
export function TrackImpressions() {
    useEffect(() => {
        fetch(`${API_BASE_URL}/somaapp/track-impressions/`, {
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
