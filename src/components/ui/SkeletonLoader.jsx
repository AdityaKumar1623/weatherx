import React from "react";

function Bone({ className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.06] animate-pulse ${className}`}
    />
  );
}

export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {/* Hero row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Bone className="lg:col-span-2 h-72" />
        <Bone className="h-72" />
      </div>
      {/* Insight row */}
      <Bone className="h-40" />
      {/* Activity row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Bone className="h-28" />
        <Bone className="h-28" />
        <Bone className="h-28" />
        <Bone className="h-28" />
      </div>
    </div>
  );
}
