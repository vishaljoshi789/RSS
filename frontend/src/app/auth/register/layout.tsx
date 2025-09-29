import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - RSS Rashtriya Swayamsevak Sangh',
  description: 'Register to join RSS community and contribute to nation building',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}