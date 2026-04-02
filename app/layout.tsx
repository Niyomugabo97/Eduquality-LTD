import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Cart from "@/components/Cart";

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
        <CartProvider>
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
