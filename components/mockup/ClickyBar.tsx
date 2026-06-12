"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LAYOUT_TWEEN = { type: "tween", duration: 0.72, ease: [0, 0, 0.15, 1] } as const;

const GLASS = {
  background: "rgba(18,18,22,0.62)",
  backdropFilter: "blur(32px) saturate(200%)",
  WebkitBackdropFilter: "blur(32px) saturate(200%)",
  border: "0.5px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.28), 0 8px 40px rgba(0,0,0,0.25)",
} as const;

// Fixed expanded width: 540px body + 32px padding
const EXPANDED_W = 572;

export default function ClickyBar() {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [collapsedW, setCollapsedW] = useState<number | "auto">("auto");

  // Measure natural header width once on mount (component starts collapsed)
  useEffect(() => {
    if (ref.current) setCollapsedW(ref.current.offsetWidth);
  }, []);

  return (
    <motion.div
      ref={ref}
      animate={{ width: expanded ? EXPANDED_W : collapsedW }}
      transition={LAYOUT_TWEEN}
      style={{
        ...GLASS,
        borderRadius: 20,
        padding: "16px 16px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header row — always visible */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
        {/* Logo + wordmark */}
        <img
          src="/icons/clickyLogo.svg"
          alt="Clicky"
          width={58}
          height={18}
          style={{ display: "block", filter: "brightness(0) invert(1)", flexShrink: 0 }}
        />

        {/* Settings + Show/Hide */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <img src="/mockup/settings.svg" alt="" width={16} height={16} style={{ opacity: 0.75, display: "block" }} />
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.18)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22)",
              borderRadius: 8,
              padding: "4px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              color: "white",
              fontSize: 13,
              whiteSpace: "nowrap",
              fontFamily: "inherit",
            }}
          >
            {expanded && (
              <img src="/mockup/arrow-down.svg" alt="" width={13} height={13} style={{ display: "block" }} />
            )}
            {expanded ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 0.3, ease: [0, 0, 0.2, 1] } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.55, ease: [0.35, 0, 0.8, 1] } }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ marginTop: 20, width: 540 }}>
              {/* Hold option+ctrl to speak */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                marginBottom: 16,
                whiteSpace: "nowrap",
              }}>
                <span>Hold</span>
                <div style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.16)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  padding: "4px 10px 4px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <img src="/mockup/option-key.svg" alt="" width={11} height={9} style={{ display: "block" }} />
                  <span style={{ fontSize: 11, fontWeight: 500 }}>option</span>
                </div>
                <span style={{ fontWeight: 400 }}>+</span>
                <div style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.16)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                  borderRadius: 6,
                  padding: "4px 10px 4px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  <img src="/mockup/option-key.svg" alt="" width={11} height={9} style={{ display: "block" }} />
                  <span style={{ fontSize: 11, fontWeight: 500 }}>ctrl</span>
                </div>
                <span>to speak</span>
              </div>

              {/* Input */}
              <div style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 39,
              }}>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                  Ask a question
                </span>
                <img src="/mockup/mic.svg" alt="" width={16} height={16} style={{ display: "block" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
