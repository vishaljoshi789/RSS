import type { NextConfig } from "next";

type RemotePatternConfig = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname?: string;
};

const mediaApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
let mediaHostname: string | undefined;

try {
  mediaHostname = mediaApiUrl ? new URL(mediaApiUrl).hostname : undefined;
} catch (error) {
  console.warn("Invalid NEXT_PUBLIC_API_URL provided. Falling back to defaults.");
}

const DEFAULT_IMAGE_HOSTS = new Set<string>([
  "localhost",
  "127.0.0.1",
  "joinrss.org.in",
  "app.joinrss.org.in",
  "*.joinrss.org.in",
  "blogger.googleusercontent.com",
  "panchjanya.com",
  "banner2.cleanpng.com",
  "cdn.iconscout.com",
  "www.pikpng.com",
  "m.media-amazon.com",
  "vectorseek.com",
  "logodix.com",
  "etimg.etb2bimg.com",
  "www.brandcolorcode.com",
  "images.unsplash.com",
]);

const envHosts = (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

envHosts.forEach((host) => DEFAULT_IMAGE_HOSTS.add(host));

if (mediaHostname) {
  DEFAULT_IMAGE_HOSTS.add(mediaHostname);
}

const remotePatterns: RemotePatternConfig[] = Array.from(DEFAULT_IMAGE_HOSTS).flatMap(
  (hostname) => [
    { protocol: "https", hostname },
    { protocol: "http", hostname },
  ]
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  }
};

export default nextConfig;