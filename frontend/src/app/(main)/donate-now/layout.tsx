import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'दान करें - राष्ट्रीय सेवा संघ भारतवर्ष',
  description: 'राष्ट्रीय सेवा संघ के सामाजिक कल्याण, शिक्षा, और राष्ट्र सेवा कार्यों में योगदान करें। आपका हर दान समाज की भलाई में उपयोग होता है।',
  keywords: [
    'राष्ट्रीय सेवा संघ दान',
    'RSS दान',
    'धर्म दान',
    'सामाजिक सेवा दान',
    'ऑनलाइन दान',
    'भारत दान',
    'हिंदू संगठन दान',
    'शिक्षा दान',
    'समाज सेवा',
    'धार्मिक दान',
    'राष्ट्र सेवा',
    'सुरक्षित भुगतान'
  ],
  openGraph: {
    title: 'दान करें - राष्ट्रीय सेवा संघ भारतवर्ष',
    description: 'राष्ट्र सेवा में योगदान करें। आपका हर दान सामाजिक कल्याण, शिक्षा और राष्ट्रीय एकता के कार्यों में उपयोग होता है।',
    images: [
      {
        url: '/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'राष्ट्रीय सेवा संघ - दान और सेवा',
      },
    ],
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'दान करें - राष्ट्रीय सेवा संघ भारतवर्ष',
    description: 'राष्ट्र सेवा में योगदान करें। सुरक्षित और पारदर्शी दान प्रक्रिया।',
    images: ['/live/logo.png'],
  },
  alternates: {
    canonical: '/donate-now',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'theme-color': '#FF6B35',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
