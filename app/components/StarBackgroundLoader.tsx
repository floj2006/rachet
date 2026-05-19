"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr:false must live inside a Client Component
const StarBackground = dynamic(() => import("./StarBackground"), { ssr: false });

export default function StarBackgroundLoader() {
  return <StarBackground />;
}
