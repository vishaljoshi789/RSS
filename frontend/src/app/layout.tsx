import type { Metadata } from "next";
import { Lato, Poppins, Nunito } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/sonner";


const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://joinrss.org.in"),
  title: {
    default: "राष्ट्रीय सेवा संघ - RASHTRIYA SEVA SANGH",
    template: "%s | राष्ट्रीय सेवा संघ",
  },
  description:
    "अब समय केवल देखने का नहीं, कुछ करने का है। सेवा ही धर्म है — और यही राष्ट्र का भाग्य बदल सकता है। राष्ट्रीय सेवा संघ से जुड़िए, राष्ट्र आपकी प्रतीक्षा कर रहा है।",
  keywords: [
    "राष्ट्रीय सेवा संघ",
    "RSS",
    "Rashtriya Seva Sangh",
    "सेवा",
    "धर्म",
    "राष्ट्र",
    "भारत",
    "वैदिक",
    "संस्कार",
    "social service",
    "community service",
    "dharma",
    "nation building",
  ],
  authors: [{ name: "RASHTRIYA SEVA SANGH", url: "https://joinrss.org.in" }],
  creator: "RASHTRIYA SEVA SANGH",
  publisher: "RASHTRIYA SEVA SANGH",
  category: "Social Organization",
  classification: "Social Service Organization",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://joinrss.org.in/",
    siteName: "RASHTRIYA SEVA SANGH",
    title: "राष्ट्रीय सेवा संघ - RASHTRIYA SEVA SANGH",
    description:
      "अब समय केवल देखने का नहीं, कुछ करने का है। सेवा ही धर्म है — और यही राष्ट्र का भाग्य बदल सकता है। राष्ट्रीय सेवा संघ से जुड़िए, राष्ट्र आपकी प्रतीक्षा कर रहा है।",
    images: [
      {
        url: "/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "राष्ट्रीय सेवा संघ - RASHTRIYA SEVA SANGH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@joinrssgroup",
    creator: "@joinrssgroup",
    title: "राष्ट्रीय सेवा संघ - RASHTRIYA SEVA SANGH",
    description:
      "अब समय केवल देखने का नहीं, कुछ करने का है। सेवा ही धर्म है — और यही राष्ट्र का भाग्य बदल सकता है। राष्ट्रीय सेवा संघ से जुड़िए, राष्ट्र आपकी प्रतीक्षा कर रहा है।",
    images: ["/logo/logo.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://joinrss.org.in/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
      { url: "/logo/logo.png", type: "image/png" },
      { url: "/logo/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/logo/logo.png", sizes: "180x180", type: "image/png" },
      { url: "/logo/logo.png", sizes: "152x152", type: "image/png" },
      { url: "/logo/logo.png", sizes: "144x144", type: "image/png" },
      { url: "/logo/logo.png", sizes: "120x120", type: "image/png" },
      { url: "/logo/logo.png", sizes: "114x114", type: "image/png" },
      { url: "/logo/logo.png", sizes: "76x76", type: "image/png" },
      { url: "/logo/logo.png", sizes: "72x72", type: "image/png" },
      { url: "/logo/logo.png", sizes: "60x60", type: "image/png" },
      { url: "/logo/logo.png", sizes: "57x57", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/logo/logo.png",
        color: "#fd9800",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RSS",
    startupImage: [
      {
        url: "/logo/logo.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo/logo.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo/logo.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "RSS",
    "application-name": "राष्ट्रीय सेवा संघ",
    "msapplication-TileColor": "#fd9800",
    "msapplication-TileImage": "/logo/logo.png",
    "msapplication-config": "none",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" dir="ltr">
      <head>
        <link rel="icon" href="/logo/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo/logo.png" type="image/png" />

        <meta name="theme-color" content="#fd9800" />
        <meta name="msapplication-TileColor" content="#fd9800" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://joinrss.org.in/#organization",
                  name: "RASHTRIYA SEVA SANGH",
                  alternateName: "राष्ट्रीय सेवा संघ",
                  description:
                    "United for Dharma, Dedicated for Nation. A social service organization dedicated to nation building through dharmic values.",
                  url: "https://joinrss.org.in/",
                  foundingDate: "2023",
                  areaServed: "India",
                  knowsLanguage: ["hi", "en"],
                  logo: {
                    "@type": "ImageObject",
                    url: "https://joinrss.org.in/logo/logo.png",
                    width: 300,
                    height: 300,
                    caption: "राष्ट्रीय सेवा संघ Logo",
                  },
                  sameAs: [
                    "https://www.facebook.com/joinrssgroup",
                    "https://x.com/joinrssgroup",
                    "https://www.instagram.com/joinrssgroupofficial",
                    "https://youtube.com/@joinrssgroup",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "customer service",
                    areaServed: "IN",
                    availableLanguage: ["Hindi", "English"],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://joinrss.org.in/#website",
                  url: "https://joinrss.org.in/",
                  name: "RASHTRIYA SEVA SANGH",
                  alternateName: "राष्ट्रीय सेवा संघ",
                  publisher: {
                    "@id": "https://joinrss.org.in/#organization",
                  },
                  inLanguage: ["hi-IN", "en-IN"],
                  isAccessibleForFree: true,
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://joinrss.org.in/?s={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body
        className={`${lato.variable} ${poppins.variable} ${nunito.variable} antialiased m-0 p-0 w-full overflow-x-hidden`}
      >
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </Link>
        <Provider>{children}</Provider>
        <Toaster richColors/>
      </body>
    </html>
  );
}
