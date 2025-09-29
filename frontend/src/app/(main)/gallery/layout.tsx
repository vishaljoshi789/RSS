import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'फोटो और वीडियो गैलरी - राष्ट्रीय सेवा संघ भारतवर्ष',
  description: 'राष्ट्रीय सेवा संघ की गतिविधियों, धार्मिक समारोहों, सामाजिक सेवा और सामुदायिक कार्यक्रमों की फोटो और वीडियो गैलरी। हमारे संगठन के कार्यों और योगदान की झलकियां देखें।',
  keywords: [
    'राष्ट्रीय सेवा संघ',
    'RSS फोटो गैलरी', 
    'वीडियो गैलरी',
    'धार्मिक समारोह',
    'सामाजिक सेवा',
    'सामुदायिक कार्यक्रम',
    'रक्तदान शिविर',
    'मंदिर सेवा',
    'युवा प्रशिक्षण',
    'सांस्कृतिक उत्सव'
  ],
  openGraph: {
    title: 'फोटो और वीडियो गैलरी - राष्ट्रीय सेवा संघ भारतवर्ष',
    description: 'हमारी गतिविधियों, समारोहों और सामुदायिक कार्यक्रमों की यादों का संकलन',
    images: [
      {
        url: 'https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-scaled.webp',
        width: 1200,
        height: 630,
        alt: 'राष्ट्रीय सेवा संघ - सामुदायिक गतिविधियां',
      },
    ],
    type: 'website',
    locale: 'hi_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'फोटो और वीडियो गैलरी - राष्ट्रीय सेवा संघ भारतवर्ष',
    description: 'हमारी गतिविधियों, समारोहों और सामुदायिक कार्यक्रमों की यादों का संकलन',
    images: ['https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-scaled.webp'],
  },
  alternates: {
    canonical: '/gallery',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
