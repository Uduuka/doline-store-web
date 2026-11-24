import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";

/**
 * The Doline Store user manual, one chapter per file in `content/manual`. The files are copied
 * from the app repo's `docs/lilli/manual` — the same text staff read in the app's Help screen and
 * Lilli answers from — so keep the two in step: copy them over when the app's manual changes.
 *
 * Each file opens with `## N. Title `[Access]``; `###` headings are its parts, and other
 * chapters are referred to as "section N", which become links here. Screenshots are image lines
 * on their own (`![what it shows](https://downloads.dolinesystems.com/manual/…)`); each becomes a
 * figure, its description shown as the caption.
 */
const DIR = path.join(process.cwd(), "content", "manual");

export type Access = "Everyone" | "Admins only" | "Partly admin";

export type Chapter = {
  number: number;
  slug: string;
  title: string;
  access: Access;
  /** The chapter's own parts, for the in-page contents. */
  parts: { id: string; title: string }[];
  html: string;
  summary: string;
};

export const GROUPS: { title: string; from: number; to: number }[] = [
  { title: "Getting started", from: 1, to: 8 },
  { title: "Selling", from: 9, to: 11 },
  { title: "Stock", from: 12, to: 14 },
  { title: "Orders and people", from: 15, to: 18 },
  { title: "Running the shop", from: 19, to: 24 },
  { title: "Messages", from: 25, to: 25 },
];

const ACCESS: Record<string, Access> = { Both: "Everyone", "Admin only": "Admins only", Mixed: "Partly admin" };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The manual's double hyphens are dashes. */
const dashes = (md: string) => md.replace(/(\s)--(?=\s)/g, "$1—");

function parse(file: string): Omit<Chapter, "html"> & { body: string } {
  const raw = readFileSync(path.join(DIR, file), "utf8");
  const m = raw.match(/^##\s+(\d+)\.\s+(.+?)\s*(?:`\[(.+?)\]`)?\s*$/m);
  if (!m) throw new Error(`Manual chapter ${file} has no "## N. Title" heading`);
  const number = Number(m[1]);
  const title = m[2]!.trim();
  const body = dashes(raw.slice(m.index! + m[0].length).trim());
  const parts = [...body.matchAll(/^###\s+(.+)$/gm)].map((h) => ({ id: slugify(h[1]!), title: h[1]!.replace(/[*`]/g, "").trim() }));
  const firstPara = body.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("#")) ?? "";
  const summary = firstPara.replace(/\s+/g, " ").replace(/[*`]/g, "").trim();
  return {
    number,
    slug: slugify(title),
    title,
    access: ACCESS[m[3] ?? "Both"] ?? "Everyone",
    parts,
    summary: summary.length > 180 ? `${summary.slice(0, 177).replace(/\s+\S*$/, "")}…` : summary,
    body,
  };
}

function render(body: string, slugs: Map<number, string>): string {
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        // The file's "##" is the page's h1, so its "###" parts are h2s.
        const level = Math.min(Math.max(depth - 1, 2), 4);
        return `<h${level} id="${slugify(text)}">${inner}</h${level}>\n`;
      },
      table(token: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: "th" | "td") => `<${tag}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        const head = `<tr>${token.header.map((c) => cell(c, "th")).join("")}</tr>`;
        const rows = token.rows.map((r) => `<tr>${r.map((c) => cell(c, "td")).join("")}</tr>`).join("");
        return `<div class="manual-table"><table><thead>${head}</thead><tbody>${rows}</tbody></table></div>\n`;
      },
      image({ href, text }: Tokens.Image) {
        return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">`;
      },
      paragraph({ tokens }: Tokens.Paragraph) {
        // A screenshot on its own line is a figure, captioned with what it shows.
        const only = tokens.filter((t) => !(t.type === "text" && !t.raw.trim()));
        if (only.length === 1 && only[0]!.type === "image") {
          const img = only[0] as Tokens.Image;
          return `<figure class="manual-shot">${this.parser.parseInline([img])}<figcaption aria-hidden="true">${escapeHtml(img.text)}</figcaption></figure>\n`;
        }
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
    },
  });
  const html = marked.parse(body, { async: false });
  // "section 14" → a link to that chapter, in text only: tags (an image's alt, say) are left alone.
  return html
    .split(/(<[^>]*>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part.replace(/\b([Ss]ections?) (\d{1,2})\b/g, (all, word: string, n: string) => {
            const slug = slugs.get(Number(n));
            return slug ? `<a href="/docs/${slug}">${word} ${n}</a>` : all;
          }),
    )
    .join("");
}

let cache: Chapter[] | null = null;

/** Every chapter, in order. Read once per build from `content/manual`. */
export function getChapters(): Chapter[] {
  if (cache) return cache;
  const parsed = readdirSync(DIR)
    .filter((f) => /^\d+-.+\.md$/.test(f))
    .map(parse)
    .sort((a, b) => a.number - b.number);
  const slugs = new Map(parsed.map((c) => [c.number, c.slug]));
  cache = parsed.map(({ body, ...c }) => ({ ...c, html: render(body, slugs) }));
  return cache;
}

export function getChapter(slug: string): Chapter | undefined {
  return getChapters().find((c) => c.slug === slug);
}
