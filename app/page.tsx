"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import DesktopMockup from "@/components/mockup/DesktopMockup";

export default function Home() {
  const navLogoRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return (
    <>
      <DesktopMockup introComplete={true} navLogoRef={navLogoRef} />

      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50"
        style={{ x: springX, y: springY }}
      >
        <Image
          src="/icons/clicky.svg"
          alt=""
          width={15}
          height={15}
          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.22))" }}
          priority
        />
      </motion.div>
    </>
  );
}
