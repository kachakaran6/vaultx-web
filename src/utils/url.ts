export function ensureUrlProtocol(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function normalizeUrl(url: string): string {
  const prepared = ensureUrlProtocol(url);
  if (!prepared) {
    return "";
  }

  try {
    const parsed = new URL(prepared);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const path = parsed.pathname.replace(/\/+$/, "");
    const query = parsed.search;
    return `${host}${path}${query}`.toLowerCase();
  } catch {
    return prepared.trim().toLowerCase();
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(ensureUrlProtocol(url)).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(ensureUrlProtocol(url));
    return ["http:", "https:"].includes(parsed.protocol) && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function extractUrlFromText(input: string): string | null {
  const match = input.match(/https?:\/\/[^\s]+/i);
  if (!match) {
    return null;
  }

  return isValidHttpUrl(match[0]) ? match[0] : null;
}

export function buildFaviconUrl(url: string): string {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
