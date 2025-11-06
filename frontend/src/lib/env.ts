let cachedApiBaseUrl: string | null = null;

function normalizeBaseUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getApiBaseUrl(): string {
  if (cachedApiBaseUrl) {
    return cachedApiBaseUrl;
  }

  const value = process.env.NEXT_PUBLIC_API_URL;

  if (!value) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is required but was not provided. Define it in your environment configuration to load remote media and call the API."
    );
  }

  cachedApiBaseUrl = normalizeBaseUrl(value);
  return cachedApiBaseUrl;
}
