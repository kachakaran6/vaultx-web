import type { LinkRecord } from "../store/types";

export async function encodeSharedLinks(links: LinkRecord[]): Promise<string> {
  const json = JSON.stringify(links);
  const base64 = btoa(encodeURIComponent(json));
  return base64;
}

export async function decodeSharedLinks(payload: string): Promise<LinkRecord[]> {
  try {
    const json = decodeURIComponent(atob(payload));
    const links = JSON.parse(json) as LinkRecord[];
    if (!Array.isArray(links)) {
      throw new Error("Invalid payload format");
    }
    return links;
  } catch (error) {
    console.error("Failed to decode shared links:", error);
    throw new Error("Failed to decode shared links");
  }
}
