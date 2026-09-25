import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";

export const metadata: Metadata = {
  title: "NIBEZA FOUNDATION",
  description: "NIBEZA Foundation is dedicated to protecting, supporting and empowering orphaned and vulnerable children through education, spiritual guidance, mentorship, protection and community partnerships.",
  generator: "NIBEZA FOUNDATION",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
