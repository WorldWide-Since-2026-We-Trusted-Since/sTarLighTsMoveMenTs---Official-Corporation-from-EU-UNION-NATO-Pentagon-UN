/**
 * @license
 * SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wrench, 
  Container, 
  Globe, 
  Shield, 
  Package, 
  ExternalLink,
  Code,
  Cloud
} from 'lucide-react';

// Tool definitions extracted from the project
const TOOL_CATEGORIES = {
  EBENE_5: {
    title: "Ebene 5: NPM Dependencies",
    icon: Package,
    color: "text-purple-400",
    tools: [
      { name: "react", install: "npm install react", url: "https://react.dev" },
      { name: "react-dom", install: "npm install react-dom", url: "https://react.dev" },
      { name: "vite", install: "npm install -D vite", url: "https://vitejs.dev" },
      { name: "typescript", install: "npm install -D typescript", url: "https://typescriptlang.org" },
      { name: "tailwindcss", install: "npm install -D tailwindcss", url: "https://tailwindcss.com" },
      { name: "eslint", install: "npm install -D eslint", url: "https://eslint.org" },
      { name: "recharts", install: "npm install recharts", url: "https://recharts.org" },
      { name: "motion", install: "npm install motion", url: "https://motion.dev" },
    ]
  },
  EBENE_6: {
    title: "Ebene 6: Projekt Scripts",
    icon: Code,
    color: "text-blue-400",
    tools: [
      { name: "ide-tool-scanner.js", install: "node scripts/ide-tool-scanner.js", url: "#" },
      { name: "autonomous-security.js", install: "node scripts/autonomous-security.js", url: "#" },
      { name: "pnia-audit-security.js", install: "node scripts/pnia-audit-security.js", url: "#" },
      { name: "security-headers.js", install: "node scripts/security-headers.js", url: "#" },
      { name: "ssh-tunnel.sh", install: "bash scripts/ssh-tunnel.sh", url: "#" },
    ]
  },
  EBENE_7: {
    title: "Ebene 7: Container & Cloud",
    icon: Container,
    color: "text-cyan-400",
    tools: [
      { name: "Docker", install: "curl -fsSL https://get.docker.com | sh", url: "https://docker.com" },
      { name: "Netlify CLI", install: "npm install -g netlify-cli", url: "https://netlify.com" },
      { name: "Wrangler", install: "npm install -g wrangler", url: "https://workers.cloudflare.com" },
    ]
  },
  EBENE_8: {
    title: "Ebene 8: Institutionelle URLs",
    icon: Globe,
    color: "text-emerald-400",
    tools: [
      { name: "EU Kommission", install: "n/a", url: "https://ec.europa.eu" },
      { name: "NATO", install: "n/a", url: "https://www.nato.int" },
      { name: "UN", install: "n/a", url: "https://www.un.org" },
      { name: "Bundestag", install: "n/a", url: "https://www.bundestag.de" },
      { name: "US DoD", install: "n/a", url: "https://www.defense.gov" },
    ]
  },
  EBENE_9: {
    title: "Ebene 9: Deployment",
    icon: Cloud,
    color: "text-amber-400",
    tools: [
      { name: "GitHub", install: "git clone <repo>", url: "https://github.com" },
      { name: "Netlify", install: "netlify deploy --prod --dir=dist", url: "https://app.netlify.com" },
    ]
  }
};

const SECURITY_TOOLS = [
  { name: "HNOSS HCOS", command: "node scripts/autonomous-security.js", icon: Shield },
  { name: "PNIA Audit", command: "node scripts/pnia-audit-security.js", icon: Shield },
  { name: "Security Headers", command: "node scripts/security-headers.js", icon: Shield },
  { name: "IDE Scanner", command: "node scripts/ide-tool-scanner.js", icon: Wrench },
];

export default function ToolchainMap() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof TOOL_CATEGORIES>('EBENE_5');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSelectedTool(text);
    setTimeout(() => setSelectedTool(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wrench className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
            HNOSS Interactive Tool Map
          </h1>
        </div>
        <p className="text-gray-400 font-mono">
          PNIA Toolchain Matrix mit Installation & Pull Befehlen
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Object.entries(TOOL_CATEGORIES).map(([key, category]) => (
          <motion.button
            key={key}
            onClick={() => setActiveCategory(key as keyof typeof TOOL_CATEGORIES)}
            className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
              activeCategory === key
                ? 'border-amber-400 bg-amber-950/30 text-white'
                : 'border-gray-700 bg-black/40 text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <category.icon className={`w-4 h-4 ${category.color}`} />
            <span className="text-xs font-mono">{category.title}</span>
          </motion.button>
        ))}
      </div>

      {/* Tool Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {TOOL_CATEGORIES[activeCategory].tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              className="p-4 rounded-lg border border-gray-800 bg-black/60 hover:border-amber-400/50 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white">{tool.name}</h3>
                {tool.url !== '#' && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="bg-black/60 border border-gray-700 rounded p-2 mb-3">
                <code className="text-xs text-green-400 font-mono break-all">
                  {tool.install}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(tool.install)}
                className="w-full py-1.5 text-xs font-mono bg-amber-950/30 hover:bg-amber-950/50 rounded transition-all"
              >
                {selectedTool === tool.install ? '✓ Kopiert!' : 'Kopieren'}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Security Tools Section */}
      <motion.div
        className="mt-12 p-6 border border-amber-400/30 rounded-lg bg-gradient-to-br from-black/60 to-purple-950/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Sicherheits-Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECURITY_TOOLS.map((tool) => (
            <div key={tool.name} className="p-3 border border-gray-800 rounded bg-black/40">
              <div className="flex items-center gap-2 mb-2">
                <tool.icon className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-sm text-white">{tool.name}</span>
              </div>
              <code className="text-xs text-cyan-400 font-mono">{tool.command}</code>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Commands */}
      <motion.div
        className="mt-8 p-4 border border-gray-800 rounded-lg bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-bold text-amber-400 mb-3">Quick Install Commands</h3>
        <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`# Alle Dependencies installieren
npm install --legacy-peer-deps

# Build für Production
npm run build

# Security Audit durchführen
node scripts/autonomous-security.js

# Deploy zu Netlify
netlify deploy --prod --dir=dist`}
        </pre>
      </motion.div>
    </div>
  );
}