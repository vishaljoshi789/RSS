import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - RSS RASHTRIYA SEVA SANGH',
  description: 'Register to join RSS community and contribute to nation building. Create your account to access RSS resources and connect with fellow members.',
  keywords: 'RSS, registration, join RSS, Hindu organization, nationalism, Bharat',
  openGraph: {
    title: 'Register - RSS RASHTRIYA SEVA SANGH',
    description: 'Join RSS community and contribute to nation building',
    type: 'website',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}