import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | RSS Dashboard",
  description: "Manage your account settings and profile information",
};

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
