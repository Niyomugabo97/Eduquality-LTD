import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MY EDUQUALITY PARTNER LTD",
  description: "Multi-service company providing educational support, business services, beauty care, delivery solutions, and charitable activities",
  generator: "MY EDUQUALITY PARTNER LTD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
