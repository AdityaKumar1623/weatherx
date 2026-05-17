import React from "react";

export default function GlassCard({ children, className = "", onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={[
        "relative rounded-2xl border border-white/10",
        "bg-white/[0.06] backdrop-blur-md",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        hover
          ? "cursor-pointer hover:bg-white/[0.10] hover:border-white/20 transition-all duration-300 hover:scale-[1.015]"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
