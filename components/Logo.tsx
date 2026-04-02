"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="fixed top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg border border-blue-100">
      <Image
        src="/images/logo.jpeg"
        alt="MY EDUQUALITY PARTNER LTD Logo"
        width={60}
        height={60}
        className="w-12 h-12 md:w-16 md:h-16 object-contain"
        priority
      />
    </div>
  );
}
