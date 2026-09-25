"use client";

import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo.jpeg"
      alt="NIBEZA Foundation logo"
      width={64}
      height={64}
      className={className ?? "w-16 h-16 object-contain rounded-full bg-white"}
      priority
    />
  );
}
