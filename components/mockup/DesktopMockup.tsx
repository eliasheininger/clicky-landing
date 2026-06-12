"use client";

import { motion } from "framer-motion";
import ClickyBar from "./ClickyBar";
import AgentButton from "./AgentButton";
import MacDock from "./MacDock";

const SPRING = { type: "spring", stiffness: 400, damping: 15 } as const;

interface Props {
  introComplete: boolean;
  navLogoRef: React.RefObject<HTMLDivElement | null>;
}

export default function DesktopMockup({ introComplete, navLogoRef }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Background wallpaper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/mockup/wallpaperswide.com-windows-xp-original-wallpaper-3840x2160.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(68,68,68,0.2)",
          zIndex: 1,
        }}
      />
      {/* Additional black overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.1)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "flex-start",
            padding: "15px 0 0",
            pointerEvents: "none",
          }}
        >
          {/* Left nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              paddingLeft: 4,
              paddingTop: 8,
              pointerEvents: "auto",
              flexShrink: 0,
            }}
          >
            {/* Clicky polygon logo */}
            {/* <div
              ref={navLogoRef}
              style={{ width: 25, height: 25, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <img
                src="/mockup/clicky-logo-nav.svg"
                alt="Clicky"
                width={18}
                height={16}
                style={{ display: "block", transform: "rotate(30deg)" }}
              />
            </div> */}

            {/* FAQ */}
            <a
              href="#"
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.06em",
                textDecoration: "none",
                paddingLeft: 17,
                lineHeight: 1,
              }}
            >
              FAQ
            </a>

            {/* Blog */}
            <a
              href="#"
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.06em",
                textDecoration: "none",
                paddingLeft: 18,
                lineHeight: 1,
              }}
            >
              Blog
            </a>
          </div>

          {/* Spacer to push agent buttons right */}
          <div style={{ flex: 1 }} />

          {/* Center: Clicky bar — absolutely centered on screen */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 15,
              transform: "translateX(-50%)",
              pointerEvents: "auto",
            }}
          >
            <ClickyBar />
          </div>

          {/* Right: Agent buttons */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              paddingRight: 40,
              flexShrink: 0,
              pointerEvents: "auto",
            }}
          >
            <AgentButton icon="/mockup/agent1.svg" agentIndex={0} />
            <AgentButton icon="/mockup/agent2.svg" agentIndex={1} />
          </motion.div>
        </div>

        {/* ── Hero ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "14vh",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              fontFamily: "var(--font-manrope)",
              margin: 0,
              maxWidth: 770,
            }}
          >
            An AI Buddy that lives on your Mac and helps you out.{" "}
            <span style={{ color: "rgba(255,255,255,0.57)" }}>Anywhere.</span>
          </h1>

          <motion.button
            whileHover={{ scale: 1.04, borderRadius: "12px" }}
            whileTap={{ scale: 0.94, borderRadius: "28px" }}
            transition={SPRING}
            style={{
              marginTop: 36,
              background: "black",
              border: "none",
              borderRadius: 16,
              padding: "16px 40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 48,
              boxShadow: "0px 2px 2px rgba(0,0,0,0.25)",
              pointerEvents: "auto",
            }}
          >
            <img src="/mockup/apple-white.svg" alt="" width={14} height={14} style={{ display: "block" , paddingBottom: 2}} />
            <span
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "-0.06em",
                whiteSpace: "nowrap",
              }}
            >
              Download for Mac
            </span>
          </motion.button>

          <p
            style={{
              marginTop: 12,
              color: "rgba(0,0,0,0.75)",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              pointerEvents: "auto",
            }}
          >
            On windows?{" "}
            <a
              href="#"
              style={{ color: "rgba(0,0,0,0.75)", textDecorationColor: "rgba(255,255,255,0.5)", textDecoration: "underline" }}
            >
              Join Waitlist
            </a>
          </p>
        </div>

        {/* ── Dock ── */}
        <div
          style={{
            position: "absolute",
            bottom: "5vh",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <MacDock />
        </div>
      </motion.div>
    </div>
  );
}
