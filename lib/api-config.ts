/**
 * Base origin for the Django API (no trailing slash).
 * Set NEXT_PUBLIC_API_BASE_URL in production (e.g. https://your-api.up.railway.app).
 */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw) return normalizeBaseUrl(raw);
  return "http://localhost:8000";
}

export const API_BASE_URL = getApiBaseUrl();
