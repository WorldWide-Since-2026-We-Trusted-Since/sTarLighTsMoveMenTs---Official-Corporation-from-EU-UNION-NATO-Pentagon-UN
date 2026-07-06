/**
 * @license SPDX-License-Identifier: EU-NATO-CLASSIFIED-Pilot-2026
 * @copyright Copyright © 2024–2026 Daniel Pohl. All rights reserved worldwide.
 * 
 * sTarLighTsMoveMenTs - IDE Workspace Scanner
 * Extrahiert Tools und Dependencies aus package.json für die Toolchain-Matrix
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '../');
const README_PATH = path.join(WORKSPACE_DIR, 'README.md');

console.log("🌟 Starte IDE-Workspace-Scan für sTarLighTsMoveMenTs...");

const toolMatrix = [];

// NPM Dependencies scannen (Ebene 5)
const packageJsonPath = path.join(WORKSPACE_DIR, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = require(packageJsonPath);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  for (const [name, version] of Object.entries(deps)) {
    toolMatrix.push(`| **${name}** | Ebene 5: Node.js Dependency | \`npm install ${name}\` | [npmjs.com/package/${name}](https://www.npmjs.com/package/${name}) |`);
  }
}

// Docker & YML Files scannen (Ebene 7)
function scanDockerFiles() {
  const files = fs.readdirSync(WORKSPACE_DIR);
  files.forEach(file => {
    if (file.includes('Dockerfile') || file.endsWith('.yml') || file.endsWith('.yaml')) {
      try {
        const content = fs.readFileSync(path.join(WORKSPACE_DIR, file), 'utf-8');
        const matches = content.match(/image:\s*([^\s]+)|FROM\s+([^\s]+)/g);
        if (matches) {
          matches.forEach(m => {
            const clean = m.replace(/image:\s*|FROM\s+/, '').trim();
            toolMatrix.push(`| **${clean}** | Ebene 7: Container Orchestration | \`docker pull ${clean}\` | [Docker Hub](https://hub.docker.com/search?q=${clean.split(':')[0]}) |`);
          });
        }
      } catch (e) {
        // Ignore read errors
      }
    }
  });
}
scanDockerFiles();

// Eindeutige Einträge sortieren
const uniqueMatrix = [...new Set(toolMatrix)].sort();

// Markdown-Tabelle erstellen
const matrixHeader = `| Tool / Service | Funktion / PNIA Ebene | Installations-Skript (Copy & Paste) | Repository / Herkunft |
| :--- | :--- | :--- | :--- |
`;

const newTableContent = matrixHeader.trim() + '\n' + uniqueMatrix.join('\n');

// README.md aktualisieren
if (fs.existsSync(README_PATH)) {
  let readmeContent = fs.readFileSync(README_PATH, 'utf-8');
  
  const startMarker = "## 5. Toolchain, Installation & Deployment Matrix";
  const endMarker = "## 6. Validation & Certificates";
  
  const startIndex = readmeContent.indexOf(startMarker);
  const endIndex = readmeContent.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const before = readmeContent.substring(0, startIndex + startMarker.length + 1);
    const after = readmeContent.substring(endIndex);
    
    const updatedReadme = `${before}\n\n${newTableContent}\n\n${after}`;
    fs.writeFileSync(README_PATH, updatedReadme, 'utf-8');
    console.log("✅ README.md erfolgreich durch die IDE aktualisiert!");
    console.log("\n📊 Gefundene Tools:");
    uniqueMatrix.forEach(row => console.log("  " + row));
  } else {
    console.log("⚠️ Konnte die Sektion in der README.md nicht finden.");
  }
} else {
  console.log("⚠️ README.md nicht gefunden.");
}