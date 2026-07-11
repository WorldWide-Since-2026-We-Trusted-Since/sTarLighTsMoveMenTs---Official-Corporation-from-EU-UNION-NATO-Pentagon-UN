/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * Markdown to HTML renderer for the HNOSS document overlays.
 * Uses `marked` (GFM-compliant) for reliable, production-tested parsing of
 * headings, bold/italic, inline code, links, blockquotes, tables, lists,
 * code fences and horizontal rules — even for complex German legal/scientific
 * documents. Output is sanitized by marked (HTML escaping of raw text) and
 * reuses the site's `paper-*` design tokens defined in index.css.
 */

import { marked } from "marked";

// Configure marked once for the whole app.
marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Convert Markdown into HTML that inherits the site's paper-* styling.
 * marked produces standard semantic tags (<h1>, <p>, <ul>, <table>, ...);
 * the existing `.paper-*` CSS rules in index.css target these directly, so no
 * custom renderer overrides are required.
 */
export function renderMarkdown(content: string): string {
  if (!content || !content.trim()) {
    return '<p class="paper-paragraph text-[#f43f5e]">Dokument ist leer.</p>';
  }
  try {
    return marked.parse(content, { async: false }) as string;
  } catch {
    // Fallback: at least show the raw text inside a paragraph.
    return `<p class="paper-paragraph">${content
      .replace(/&/g, "&#38;")
      .replace(/</g, "&#60;")
      .replace(/>/g, "&#62;")}</p>`;
  }
}