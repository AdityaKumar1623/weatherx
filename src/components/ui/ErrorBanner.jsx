import React from "react";
import GlassCard from "./GlassCard";

export default function ErrorBanner({ message }) {
  return (
    <GlassCard className="p-4 mb-6 border-red-500/30 bg-red-500/10">
      <p className="text-red-400 text-sm flex items-center gap-2">
        <span>⚠️</span> {message}
      </p>
    </GlassCard>
  );
}
