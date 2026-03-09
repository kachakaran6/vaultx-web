import { ensureUrlProtocol, isValidHttpUrl } from "./url";

export interface LinkMetadata {
    title: string;
    description: string;
    image?: string;
    icon?: string;
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata | null> {
    const prepared = ensureUrlProtocol(url);
    if (!isValidHttpUrl(prepared)) {
        return null;
    }

    try {
        // We use microlink API because direct fetching from browser hits CORS issues
        const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(prepared)}`);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (data.status !== "success") {
            return null;
        }

        return {
            title: data.data.title || "",
            description: data.data.description || "",
            image: data.data.image?.url || "",
            icon: data.data.logo?.url || ""
        };
    } catch (error) {
        console.warn("Metadata fetch failed", error);
        return null;
    }
}
