import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Details - Rashtriya Seva Sangh",
  description: "राष्ट्रीय सेवा संघ के मिशन की विस्तृत जानकारी",
};

export default function MissionDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <><main className="">{children}</main></>;
}
