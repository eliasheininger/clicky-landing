"use client";

import { useRef } from "react";
import DesktopMockup from "@/components/mockup/DesktopMockup";

export default function Home() {
  const navLogoRef = useRef<HTMLDivElement>(null);

  return <DesktopMockup introComplete={true} navLogoRef={navLogoRef} />;
}
