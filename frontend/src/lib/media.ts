import { getApiBaseUrl } from "./env";

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildMediaUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined;
  }

  if (isAbsoluteUrl(path)) {
    return path;
  }

  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${ensureLeadingSlash(path)}`;
}

export function getUserImageUrl(path?: string | null): string | undefined {
  return buildMediaUrl(path);
}
