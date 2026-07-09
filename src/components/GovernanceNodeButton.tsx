/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { GovernanceNode } from "../types";

interface GovernanceNodeButtonProps {
  nodeId: string;
  selectedId: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable interactive governance node button with cosmic pulse ring and shimmer effects.
 * Extracted to eliminate ~900 lines of repeated code in App.tsx.
 */
export function GovernanceNodeButton({
  nodeId,
  selectedId,
  onClick,
  children,
  className = "",
}: GovernanceNodeButtonProps) {
  const isSelected = selectedId === nodeId;

  return (
    <motion.button
      id={`node-${nodeId}`}
      onClick={onClick}
      className={`p-2.5 rounded border text-center cursor-pointer relative ${className} ${
        isSelected
          ? "border-[#fcf6ba] bg-amber-950/45 text-[#fcf6ba]"
          : "border-amber-900/30 bg-black/60 text-gray-300"
      }`}
      variants={{
        initial: { scale: 1 },
        hover: {
          scale: 1.025,
          borderColor: "#fcf6ba",
          boxShadow: "0 0 25px rgba(191, 149, 63, 0.45)",
        },
      }}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      initial="initial"
    >
      {/* Radiant Cosmic Pulse Ring */}
      <motion.div
        className="absolute -inset-[1px] rounded border border-[#bf953f]/50 pointer-events-none -z-10"
        variants={{
          initial: { opacity: 0, scale: 1 },
          hover: {
            opacity: [0, 0.6, 0],
            scale: [1, 1.08, 1.15],
            transition: {
              repeat: Infinity,
              duration: 2.0,
              ease: "easeOut",
            },
          },
        }}
      />
      {/* Inner Shimmer Boundary */}
      <div className="absolute inset-0 rounded overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent w-1/2 -skew-x-12"
          variants={{
            initial: { x: "-150%" },
            hover: {
              x: "250%",
              transition: {
                repeat: Infinity,
                duration: 1.8,
                ease: "linear",
              },
            },
          }}
        />
      </div>
      {children}
    </motion.button>
  );
}

/**
 * Helper to find a governance node by ID with a fallback.
 */
export function findNodeById(nodes: GovernanceNode[], id: string, fallbackIndex = 0): GovernanceNode {
  return nodes.find((n) => n.id === id) ?? nodes[fallbackIndex] ?? nodes[0];
}