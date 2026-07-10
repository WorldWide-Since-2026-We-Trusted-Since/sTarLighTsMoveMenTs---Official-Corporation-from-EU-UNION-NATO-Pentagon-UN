/**
 * @license SPDX-License-Identifier: Apache-2.0
 *
 * Lightweight Markdown to HTML renderer for the HNOSS document overlays.
 * Safe by design: text is HTML-escaped before any formatting is applied, so
 * document content is never injected as raw HTML. Output reuses the site's
 * paper-* design tokens defined in index.css.
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&#38;")
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
    .replace(/"/g, "&#34;")
    .replace(/'/g, "&#39;");
}

/**
 * Convert a limited, well-defined subset of Markdown into HTML.
 * Supported: headings, bold/italic, inline code, links, blockquotes,
 * horizontal rules, tables, unordered/ordered lists, paragraphs.
 */
export function renderMarkdown(content: string): string {
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  let html = "";
  let i = 0;
  const paragraph: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) html += `<p class="paper-paragraph">${text}</p>`;
    paragraph.length = 0;
  };

  while (i < lines.length) {
    const line = lines[i];

    // Blank line → paragraph break
    if (!line.trim()) {
      flushParagraph();
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      html += '<hr class="paper-divider" />';
      i++;
      continue;
    }

    // Headings
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const text = inline(heading[2]);
      html += `<h${level} class="paper-heading paper-h${level}">${text}</h${level}>`;
      i++;
      continue;
    }

    // Blockquote (may span multiple lines)
    if (/^>\s?/.test(line)) {
      flushParagraph();
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(inline(lines[i].replace(/^>\s?/, "")));
        i++;
      }
      html += `<blockquote class="paper-quote">${quote.join(" ")}</blockquote>`;
      continue;
    }

    // Code fence
    if (/^```/.test(line)) {
      flushParagraph();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(escapeHtml(lines[i]));
        i++;
      }
      i++; // closing fence
      html += `<pre class="paper-code"><code>${code.join("\n")}</code></pre>`;
      continue;
    }

    // Table (GFM style)
    if (
      /^\|.*\|$/.test(line.trim()) &&
      i + 1 < lines.length &&
      /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())
    ) {
      flushParagraph();
      const header = splitRow(line);
      i += 2; // skip separator row
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      html += '<table class="paper-table"><thead><tr>';
      header.forEach((c) => (html += `<th>${inline(c)}</th>`));
      html += "</tr></thead><tbody>";
      rows.forEach((r) => {
        html += "<tr>";
        r.forEach((c) => (html += `<td>${inline(c)}</td>`));
        html += "</tr>";
      });
      html += "</tbody></table>";
      continue;
    }

    // Lists
    if (/^\s*([*\-+])\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      flushParagraph();
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      const listRegex = ordered ? /^\s*\d+\.\s+(.*)$/ : /^\s*([*\-+])\s+(.*)$/;
      while (i < lines.length && listRegex.test(lines[i])) {
        const m = listRegex.exec(lines[i])!;
        items.push(`<li>${inline(m[ordered ? 1 : 2])}</li>`);
        i++;
      }
      html += ordered
        ? `<ol class="paper-list paper-list-ordered">${items.join("")}</ol>`
        : `<ul class="paper-list paper-list-unordered">${items.join("")}</ul>`;
      continue;
    }

    // Default: accumulate into paragraph buffer
    paragraph.push(inline(line));
    i++;
  }

  flushParagraph();
  return html;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/** Inline-level formatting: bold, italic, code, links. */
function inline(text: string): string {
  let out = escapeHtml(text);
  // inline code
  out = out.replace(/`([^`]+)`/g, (_m, c) => `<code class="paper-inline-code">${c}</code>`);
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, url) => {
    return `<a class="paper-link" href="${url}" target="_blank" rel="noopener noreferrer">${t}</a>`;
  });
  return out;
}