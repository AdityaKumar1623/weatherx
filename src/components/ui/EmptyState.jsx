import React from "react";
import GlassCard from "./GlassCard";

export default function EmptyState() {
  return (
    <GlassCard className="p-20 text-center">
      <div className="text-7xl mb-4">🌍</div>
      <h2 className="text-xl font-semibold text-white/65 mb-2">
        Detecting your location…
      </h2>
      <p className="text-sm text-white/30">
        Or search for a city above to get started.
      </p>
    </GlassCard>
  );
}
