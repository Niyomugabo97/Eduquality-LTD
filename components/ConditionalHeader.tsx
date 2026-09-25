"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide Header on dashboard pages (they have their own TopBar)
  const isDashboardPage = pathname?.startsWith("/dashboard");
  
  if (isDashboardPage) {
    return null;
  }
  
  return <Header />;
}
