"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

const EXAMPLE_PROMPTS = [
  '"Remove the background from this image"',
  '"Write me a blog post about this"',
  '"Summarize this article"',
  '"Book me a flight to Tokyo"',
  '"Reply to this email for me"',
];

const SPRING = { type: "spring", stiffness: 400, damping: 15 } as const;

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

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
    <main className="min-h-screen bg-white flex flex-col items-center px-6">
      {/* Nav */}
      <nav className="w-full max-w-2xl flex justify-center py-6">
        <Image src="/icons/clickyLogo.svg" alt="Clicky" width={80} height={28} priority />
      </nav>

      {/* Hero */}
      <section className="w-full max-w-xl flex flex-col items-center text-center mt-24 gap-10">
        <h1
          style={{ fontSize: "28px", letterSpacing: "-0.06em", fontWeight: 500, lineHeight: "normal" }}
        >
          An AI Buddy that lives on your mac and helps you out.{" "}
          <span style={{ color: "rgba(0,0,0,0.42)" }}>Anywhere.</span>
        </h1>

        {/* Email + Download */}
        {status === "success" ? (
          <p
            className="text-gray-500"
            style={{ fontSize: "15px", letterSpacing: "-0.06em" }}
          >
            You&apos;re on the list — we&apos;ll send the download link soon!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 w-full"
          >
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
 <p
          className="text-gray-400 -mt-6"
          style={{ fontSize: "15px", letterSpacing: "-0.02em" }}
        >
          On windows?{" "}
          <a href="#waitlist" className="underline hover:text-gray-600 transition-colors">
            Join Waitlist
          </a>
        </p>
        {status === "error" && (
          <p className="text-sm text-red-500 -mt-2">Something went wrong — try again.</p>
        )}

       
      </section>

      {/* Demo image */}
      <div className="w-full max-w-2xl mt-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="relative w-full bg-gray-900" style={{ aspectRatio: "16/9" }}>
          <Image
            src="/images/Demo.png"
            alt="Clicky demo"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay */}
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
      </div>

      {/* Example prompts */}
      <section className="flex flex-col items-center gap-3 mt-24 text-center">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <p
            key={prompt}
            className="text-black"
            style={{ fontSize: "18px", letterSpacing: "-0.06em" }}
          >
            {prompt}
          </p>
        ))}
      </section>

      {/* Cursor buddy */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50"
        style={{ x: springX, y: springY }}
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

      {/* Footer */}
      <footer className="mt-auto pb-10 pt-16">
        <p className="text-gray-400" style={{ fontSize: "13px", letterSpacing: "-0.06em" }}>
          made by farza :)
        </p>
      </footer>
    </main>
  );
}
