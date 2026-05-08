"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useAnimate,
  animate,
  AnimatePresence,
} from "framer-motion";

const EXAMPLE_PROMPTS = [
  '"Remove the background from this image"',
  '"Write me a blog post about this"',
  '"Summarize this article"',
  '"Book me a flight to Tokyo"',
  '"Reply to this email for me"',
];

const SPRING = { type: "spring", stiffness: 400, damping: 15 } as const;

// Sizes: intro icon vs nav icon
const INTRO_ICON = 32;
const NAV_ICON = 18;

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [showText, setShowText] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // Intro icon ref (for spin + pop-in)
  const [iconScope, animateIcon] = useAnimate();

  // Motion values for the intro logo group position
  const logoY = useMotionValue(0);
  const logoScale = useMotionValue(1);
  const textOpacity = useMotionValue(0);

  // Ref on nav logo to measure exact target position
  const navLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function runIntro() {
      // 1. Pop in
      await animateIcon(iconScope.current, { opacity: 1, scale: 1 }, {
        duration: 0.45,
        ease: [0.34, 1.56, 0.64, 1],
      });

      // 2. Spin 360°
      await animateIcon(iconScope.current, { rotate: 360 }, {
        duration: 0.75,
        ease: "easeInOut",
      });

      // 3. Reveal "Clicky" text
      setShowText(true);
      await animate(textOpacity, 1, { duration: 0.35, ease: "easeOut" });

      // 4. Wait a beat
      await new Promise((r) => setTimeout(r, 380));

      // 5. Measure where the nav logo sits
      const scale = NAV_ICON / INTRO_ICON;
      let targetY = -(window.innerHeight / 2 - 38); // fallback: ~38px from top

      if (navLogoRef.current) {
        const rect = navLogoRef.current.getBoundingClientRect();
        targetY = rect.top + rect.height / 2 - window.innerHeight / 2;
      }

      // 6. Move up to nav + shrink + fade text simultaneously
      await Promise.all([
        animate(logoY, targetY, { duration: 0.55, ease: [0.4, 0, 0.2, 1] }),
        animate(logoScale, scale, { duration: 0.55, ease: [0.4, 0, 0.2, 1] }),
        animate(textOpacity, 0, { duration: 0.25, ease: "easeIn" }),
      ]);

      // 7. Done — reveal real content
      setIntroComplete(true);
    }

    runIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cursor buddy (only after intro)
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (!introComplete) return;
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [introComplete, cursorX, cursorY]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  }

  return (
    <>
      {/* ── Intro overlay ── */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[90] bg-white pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Intro logo (fixed, centered, animates to nav) ── */}
      <AnimatePresence>
        {!introComplete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <motion.div style={{ y: logoY, scale: logoScale }}>
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div ref={iconScope} style={{ opacity: 0, width: INTRO_ICON, height: INTRO_ICON }}>
                  <Image
                    src="/icons/clicky.svg"
                    alt=""
                    width={INTRO_ICON}
                    height={INTRO_ICON}
                    priority
                    style={{}}
                  />
                </div>
                {/* Text */}
                <motion.span
                  style={{
                    opacity: textOpacity,
                    fontSize: "28px",
                    fontWeight: 500,
                    letterSpacing: "-0.05em",
                    color: "#171717",
                    whiteSpace: "nowrap",
                  }}
                >
                  Clicky
                </motion.span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main page ── */}
      <main className="min-h-screen bg-white flex flex-col items-center px-6">
        {/* Nav */}
        <nav className="w-full max-w-2xl flex justify-center py-6">
          <motion.div
            ref={navLogoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: introComplete ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image src="/icons/clickyLogo.svg" alt="Clicky" width={80} height={28} priority />
          </motion.div>
        </nav>

        {/* Hero */}
        <motion.section
          className="w-full max-w-xl flex flex-col items-center text-center mt-24 gap-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 14 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        >
          <h1
            style={{ fontSize: "28px", letterSpacing: "-0.06em", fontWeight: 500, lineHeight: "normal" }}
          >
            An AI Buddy that lives on your mac and helps you out.{" "}
            <span style={{ color: "rgba(0,0,0,0.42)" }}>Anywhere.</span>
          </h1>

          {status === "success" ? (
            <p className="text-gray-500" style={{ fontSize: "15px", letterSpacing: "-0.06em" }}>
              You&apos;re on the list — we&apos;ll send the download link soon!
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                className="flex-1 w-full px-4 py-3 bg-gray-100 text-[18px] outline-none placeholder:text-gray-400 transition-colors"
                style={{ borderRadius: "8px", letterSpacing: "-0.06em" }}
              />
              <motion.button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto px-6 py-3 text-white font-medium text-[18px] disabled:opacity-60 whitespace-nowrap"
                style={{ backgroundColor: "#0300CF", borderRadius: "8px", letterSpacing: "-0.06em" }}
                whileHover={{ scale: 1.04, borderRadius: "10px" }}
                whileTap={{ scale: 0.94, borderRadius: "22px" }}
                transition={SPRING}
              >
                {status === "loading" ? "..." : "Download"}
              </motion.button>
            </form>
          )}

          <p className="text-gray-400 -mt-6" style={{ fontSize: "15px", letterSpacing: "-0.02em" }}>
            On windows?{" "}
            <a href="#waitlist" className="underline hover:text-gray-600 transition-colors">
              Join Waitlist
            </a>
          </p>
          {status === "error" && (
            <p className="text-sm text-red-500 -mt-2">Something went wrong — try again.</p>
          )}
        </motion.section>

        {/* Demo image */}
        <motion.div
          className="w-full max-w-2xl mt-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 14 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative w-full bg-gray-900" style={{ aspectRatio: "16/9" }}>
            <Image src="/images/Demo.png" alt="Clicky demo" fill className="object-cover" priority />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <motion.span
                className="flex items-center gap-2 text-white font-medium bg-black/40 backdrop-blur-sm px-4 py-3"
                style={{ fontSize: "18px", borderRadius: "8px", letterSpacing: "-0.06em" }}
                whileHover={{ scale: 1.04, borderRadius: "10px" }}
                whileTap={{ scale: 0.94, borderRadius: "22px" }}
                transition={SPRING}
              >
                Watch Demo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                  <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
                  <path d="M5.5 4.5L9.5 7L5.5 9.5V4.5Z" fill="currentColor" />
                </svg>
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Example prompts */}
        <motion.section
          className="flex flex-col items-center gap-3 mt-24 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: introComplete ? 1 : 0, y: introComplete ? 0 : 14 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
        >
          {EXAMPLE_PROMPTS.map((prompt) => (
            <p key={prompt} className="text-black" style={{ fontSize: "18px", letterSpacing: "-0.06em" }}>
              {prompt}
            </p>
          ))}
        </motion.section>

        {/* Cursor buddy */}
        {introComplete && (
          <motion.div
            className="pointer-events-none fixed top-0 left-0 z-50"
            style={{ x: springX, y: springY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/icons/clicky.svg"
              alt=""
              width={20}
              height={20}
              style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.18)) drop-shadow(0 2px 4px rgba(0,0,0,0.10))" }}
              priority
            />
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          className="mt-auto pb-10 pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: introComplete ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-gray-400" style={{ fontSize: "13px", letterSpacing: "-0.06em" }}>
            made by farza :)
          </p>
        </motion.footer>
      </main>
    </>
  );
}
