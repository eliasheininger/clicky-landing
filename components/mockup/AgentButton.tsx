"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EXPAND: Parameters<typeof motion.div>[0]["transition"] = {
  type: "tween", duration: 0.38, ease: [0, 0, 0.2, 1],
};
const COLLAPSE: Parameters<typeof motion.div>[0]["transition"] = {
  type: "tween", duration: 0.45, ease: [0, 0, 0.15, 1],
};
const SHIFT = { type: "spring", stiffness: 200, damping: 28 } as const;

interface AgentButtonProps {
  icon: string;
  agentIndex: number;
}

const AGENT_CARDS = [
  {
    status: "Done",
    message: "Your fun Elias's website project is ready in your browser.",
    suggestions: ["Open it in the browser", "Make it brighter", "Add an animation"],
  },
  {
    status: "Running",
    message: "Summarizing your latest emails from this morning...",
    suggestions: ["Stop agent", "Show progress", "Open in Gmail"],
  },
];

const GLASS = {
  background: "rgba(18,18,22,0.62)",
  backdropFilter: "blur(32px) saturate(200%)",
  WebkitBackdropFilter: "blur(32px) saturate(200%)",
  border: "0.5px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.28), 0 8px 32px rgba(0,0,0,0.25)",
} as const;

export default function AgentButton({ icon, agentIndex }: AgentButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const card = AGENT_CARDS[agentIndex] ?? AGENT_CARDS[0];

  return (
    // layout tracks Y position so the sibling shifts smoothly
    <motion.div layout transition={SHIFT} style={{ alignSelf: "flex-end" }}>
      <motion.div
        onHoverStart={() => setExpanded(true)}
        onHoverEnd={() => setExpanded(false)}
        animate={{
          width: expanded ? 311 : 47,
          height: expanded ? 248 : 47,
          borderRadius: expanded ? 20 : 16,
        }}
        transition={expanded ? EXPAND : COLLAPSE}
        style={{
          ...GLASS,
          overflow: "hidden",
          cursor: expanded ? "default" : "pointer",
          position: "relative",
          zIndex: expanded ? 2 : 1,
          flexShrink: 0,
        }}
      >
        {/* Card content — always rendered, clipped to 47×47 when collapsed */}
        <div style={{ padding: 16, width: 311, boxSizing: "border-box" }}>

          {/* Header: icon + status */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <img
              src={icon}
              alt=""
              width={20}
              height={20}
              style={{
                display: "block",
                transform: "rotate(30deg)",
                flexShrink: 0,
                // Center in 47px: (47-20)/2 = 13.5px target, padding gives 16px → pull back 2.5px
                marginTop: expanded ? 0 : -2.5,
                marginLeft: expanded ? 0 : -2.5,
              }}
            />
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: 11,
              padding: "3px 8px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: card.status === "Done" ? "#4f8eff" : "#34d399",
                flexShrink: 0,
              }} />
              <span style={{ color: card.status === "Done" ? "#4f8eff" : "#34d399", fontSize: 9, fontWeight: 600 }}>
                {card.status}
              </span>
            </div>
          </div>

          {/* Message */}
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600, lineHeight: 1.4, marginBottom: 20 }}>
            {card.message}
          </p>

          {/* Input */}
          <div style={{
            background: "rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 39,
            marginBottom: 14,
          }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Ask a follow up question</span>
            <img src="/mockup/mic.svg" alt="" width={16} height={16} style={{ display: "block" }} />
          </div>

          {/* Suggestions */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 500, marginBottom: 6 }}>
              Suggestions
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {card.suggestions.map((s) => (
                <div key={s} style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "4px 9px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 500, lineHeight: 1 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
