import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - RSS RASHTRIYA SEVA SANGH',
  description: 'Login to your RSS account and access exclusive content',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}