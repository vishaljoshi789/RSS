import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "लेख | राष्ट्रीय सेवा संघ ब्लॉग",
    description: "राष्ट्रीय सेवा संघ का लेख पढ़ें",
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
