"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const SPRING = { type: "spring", stiffness: 400, damping: 22 } as const;
const ICON_SIZE = 52;
const HOVER_SIZE = 64;

const APPS = [
  { name: "Gmail", type: "single", icon: "/mockup/dock-gmail.svg" },
  { name: "Chrome", type: "layered", bg: "/mockup/dock-chrome-bg.svg", icon: "/mockup/dock-chrome.svg", iconSize: 51 },
  { name: "Instagram", type: "photo", bg: "/mockup/dock-cal-bg.svg", photo: "/mockup/dock-cal-photo.png" },
  { name: "X", type: "layered", bg: "/mockup/dock-x-bg.svg", icon: "/mockup/dock-x.png", iconSize: 64, dark: true },
] as const;

export default function MacDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div style={{ position: "relative" }}>
      {/* Liquid glass background */}
      <div
        style={{
          position: "absolute",
          inset: "-12px -16px",
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(32px) saturate(180%) brightness(1.1)",
          WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(1.1)",
          border: "0.5px solid rgba(255,255,255,0.38)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.1)",
          borderRadius: 22,
          zIndex: 0,
        }}
      />

      {/* Icons */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-end",
          gap: 20,
          padding: "0 0 2px",
        }}
      >
        {APPS.map((app, i) => {
          const isHovered = hoveredIndex === i;
          const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1;
          const size = isHovered ? HOVER_SIZE : isNeighbor ? ICON_SIZE + 8 : ICON_SIZE;

          return (
            <motion.div
              key={app.name}
              animate={{ width: size, height: size }}
              transition={SPRING}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                cursor: "default",
                flexShrink: 0,
              }}
            >
              {app.type === "single" && (
                <img src={app.icon} alt={app.name} width={size} height={size} style={{ display: "block", width: "100%", height: "100%" }} />
              )}

              {app.type === "layered" && (
                <>
                  <img
                    src={app.bg}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                  />
                  <img
                    src={app.icon}
                    alt={app.name}
                    style={{
                      position: "absolute",
                      inset: 0,
                      margin: "auto",
                      width: `${Math.round(((app.iconSize ?? 51) / ICON_SIZE) * 100)}%`,
                      height: `${Math.round(((app.iconSize ?? 51) / ICON_SIZE) * 100)}%`,
                      display: "block",
                      objectFit: "contain",
                    }}
                  />
                </>
              )}

              {app.type === "photo" && (
                <>
                  <img
                    src={app.bg}
                    alt=""
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
                  />
                  {/* Photo cropped/zoomed to fill */}
                  <div style={{ position: "absolute", inset: "-21% -21%", overflow: "hidden" }}>
                    <img
                      src={app.photo}
                      alt={app.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
