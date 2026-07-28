// Email composition — blocks in, email-safe HTML out.
//
// Blocks are stored as JSON, never as HTML. The same structure renders two
// ways: the live preview in the workspace, and table-based HTML at send time.
// That means the design system can improve later and past emails re-render
// correctly — we're never trapped in exported markup.
//
// Everything below targets the lowest common denominator: Outlook renders
// with Word's engine, so tables, inline styles, 600px width, no flexbox,
// no grid, no web fonts.

import { SERIES, FEATURED } from "./sermons";
import { upcomingEvents, formatEventDate } from "./events";

export type BlockKind =
  | "heading" | "text" | "button" | "image" | "divider" | "spacer"
  | "scripture" | "sermon" | "events" | "mission";

export type Block =
  | { id: string; kind: "heading"; text: string; align: Align }
  | { id: string; kind: "text"; text: string; align: Align }
  | { id: string; kind: "button"; label: string; href: string; align: Align }
  | { id: string; kind: "image"; src: string; alt: string }
  | { id: string; kind: "divider" }
  | { id: string; kind: "spacer"; size: "sm" | "md" | "lg" }
  | { id: string; kind: "scripture"; text: string; reference: string }
  | { id: string; kind: "sermon" }
  | { id: string; kind: "events"; count: number }
  | { id: string; kind: "mission" };

export type Align = "left" | "center";

export type EmailDraft = {
  subject: string;
  preheader: string;
  blocks: Block[];
};

/* ---------- brand tokens, duplicated here as literals ----------
   Email can't read CSS variables, so every value is inlined. */
export const INK = "#2a1c14";
export const CREAM = "#f0efec";
export const PAPER = "#ffffff";
export const AMBER = "#b19277";  // OSC gold light
export const MUTED = "#7a6a5d";
export const RULE = "#e2ddd4";
// Outlook ignores web fonts entirely — this stack degrades gracefully.
export const SANS = "'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif";
export const SERIF = "'Cormorant Garamond',Georgia,'Times New Roman',serif";
export const WIDTH = 600;

export const BLOCK_LIBRARY: { kind: BlockKind; label: string; hint: string; live?: boolean }[] = [
  { kind: "heading", label: "Heading", hint: "A large line" },
  { kind: "text", label: "Text", hint: "A paragraph" },
  { kind: "button", label: "Button", hint: "A call to action" },
  { kind: "image", label: "Image", hint: "A photo" },
  { kind: "scripture", label: "Scripture", hint: "A verse, set apart" },
  { kind: "divider", label: "Divider", hint: "A hairline rule" },
  { kind: "spacer", label: "Spacer", hint: "Breathing room" },
  { kind: "sermon", label: "Featured Film", hint: "Fills itself from the film library", live: true },
  { kind: "events", label: "Gatherings", hint: "Fills itself from the calendar", live: true },
  { kind: "mission", label: "The Mission", hint: "The Restaurant Built Together", live: true },
];

let seq = 0;
export function newBlock(kind: BlockKind): Block {
  const id = `b${++seq}-${kind}`;
  switch (kind) {
    case "heading": return { id, kind, text: "A word for you this week", align: "left" };
    case "text": return { id, kind, text: "Write it the way you'd say it from the platform.", align: "left" };
    case "button": return { id, kind, label: "See the work", href: "https://onestepcloser.org", align: "left" };
    case "image": return { id, kind, src: "/collage/06.webp", alt: "" };
    case "scripture": return { id, kind, text: "For I know the plans I have for you, declares the Lord.", reference: "Jeremiah 29:11" };
    case "spacer": return { id, kind, size: "md" };
    case "events": return { id, kind, count: 3 };
    default: return { id, kind } as Block;
  }
}

/* ---------- rendering ---------- */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Minimal inline markup so Scott can bold a phrase without an HTML editor.
export function inline(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" style="color:${INK};text-decoration:underline;">$1</a>`);
}

const SPACER_PX = { sm: 12, md: 28, lg: 48 };

function row(inner: string, pad = "0 40px") {
  return `<tr><td style="padding:${pad};">${inner}</td></tr>`;
}

export function renderBlock(b: Block, origin: string): string {
  switch (b.kind) {
    case "heading":
      return row(
        `<h1 style="margin:0;font-family:${SANS};font-size:28px;line-height:1.2;font-weight:300;color:${INK};text-align:${b.align};">${inline(b.text)}</h1>`,
        "10px 40px",
      );

    case "text":
      return row(
        `<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.65;color:${MUTED};text-align:${b.align};">${inline(b.text)}</p>`,
        "10px 40px",
      );

    case "button":
      return row(
        `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:${b.align === "center" ? "0 auto" : "0"};">
           <tr><td style="background:${INK};border-radius:100px;">
             <a href="${b.href}" style="display:inline-block;padding:14px 30px;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#ffffff;text-decoration:none;">${esc(b.label)}</a>
           </td></tr>
         </table>`,
        "14px 40px",
      );

    case "image":
      return row(
        `<img src="${b.src.startsWith("http") ? b.src : origin + b.src}" alt="${esc(b.alt)}" width="${WIDTH - 80}" style="display:block;width:100%;max-width:${WIDTH - 80}px;border:0;border-radius:3px;" />`,
        "10px 40px",
      );

    case "divider":
      return row(`<div style="height:1px;background:${RULE};line-height:1px;font-size:0;">&nbsp;</div>`, "18px 40px");

    case "spacer":
      return `<tr><td style="height:${SPACER_PX[b.size]}px;line-height:${SPACER_PX[b.size]}px;font-size:0;">&nbsp;</td></tr>`;

    case "scripture":
      return row(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
           <tr>
             <td style="border-left:2px solid ${AMBER};padding:4px 0 4px 18px;">
               <p style="margin:0;font-family:${SERIF};font-style:italic;font-size:18px;line-height:1.55;color:${INK};">${inline(b.text)}</p>
               <p style="margin:8px 0 0;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">${esc(b.reference)}</p>
             </td>
           </tr>
         </table>`,
        "14px 40px",
      );

    case "sermon": {
      const art = origin + FEATURED.art;
      return row(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};border-radius:4px;">
           <tr><td style="padding:0;">
             <img src="${art}" alt="" width="${WIDTH - 80}" style="display:block;width:100%;max-width:${WIDTH - 80}px;border:0;border-radius:4px 4px 0 0;" />
           </td></tr>
           <tr><td style="padding:24px 26px 26px;">
             <p style="margin:0;font-family:${SANS};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${AMBER};">Latest message</p>
             <p style="margin:12px 0 0;font-family:${SANS};font-size:21px;font-weight:300;line-height:1.25;color:#ffffff;">${esc(FEATURED.title)}</p>
             <p style="margin:6px 0 0;font-family:${SANS};font-size:13px;color:rgba(255,255,255,0.55);">${esc(FEATURED.part)} · ${FEATURED.parts}-part series</p>
             <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
               <tr><td style="background:#ffffff;border-radius:100px;">
                 <a href="${esc(FEATURED.href)}" style="display:inline-block;padding:12px 26px;font-family:${SANS};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${INK};text-decoration:none;">Watch now</a>
               </td></tr>
             </table>
           </td></tr>
         </table>`,
        "12px 40px",
      );
    }

    case "events": {
      const items = upcomingEvents().slice(0, b.count).map((e) => {
        const d = formatEventDate(e.date);
        return `<tr>
          <td width="62" valign="top" style="padding:14px 0;">
            <p style="margin:0;font-family:${SANS};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">${d.month}</p>
            <p style="margin:2px 0 0;font-family:${SANS};font-size:26px;font-weight:300;line-height:1;color:${INK};">${d.day}</p>
          </td>
          <td valign="top" style="padding:14px 0;border-bottom:1px solid ${RULE};">
            <p style="margin:0;font-family:${SANS};font-size:16px;font-weight:400;color:${INK};">${esc(e.title)}</p>
            <p style="margin:4px 0 0;font-family:${SANS};font-size:12.5px;color:${MUTED};">${esc(e.cadence ?? e.dateLabel)} · ${esc(e.time)} · ${esc(e.location)}</p>
          </td>
        </tr>`;
      }).join("");
      return row(
        `<p style="margin:0 0 6px;font-family:${SANS};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${MUTED};">Coming up</p>
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${items}</table>`,
        "12px 40px",
      );
    }

    case "mission":
      return row(
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#54132e;border-radius:4px;">
           <tr><td style="padding:30px 28px;">
             <p style="margin:0;font-family:${SANS};font-size:10px;letter-spacing:2.6px;text-transform:uppercase;color:rgba(250,248,242,0.55);">At Magdala &middot; Sea of Galilee</p>
             <p style="margin:14px 0 0;font-family:${SERIF};font-size:30px;line-height:1.15;color:#faf8f2;">The Restaurant Built Together</p>
             <p style="margin:12px 0 0;font-family:${SANS};font-size:14px;line-height:1.6;color:rgba(250,248,242,0.72);">A house on the shore where Christians of every tradition sit at one table &mdash; built together, so that what is built together is remembered together.</p>
           </td></tr>
         </table>`,
        "12px 40px",
      );

    default:
      return "";
  }
}

/* ---------- the full document ---------- */

export function renderEmail(draft: EmailDraft, origin = "https://onestepcloser.org"): string {
  const body = draft.blocks.map((b) => renderBlock(b, origin)).join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>${esc(draft.subject)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
<!-- Preheader: shown beside the subject in the inbox, hidden in the body -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(draft.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};">
 <tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="${WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:${WIDTH}px;max-width:100%;background:${PAPER};border-radius:4px;">

   <!-- Locked header -->
   <tr><td style="padding:34px 40px 8px;">
     <img src="${origin}/logo.png" alt="One Step Closer" width="132" style="display:block;width:132px;border:0;" />
   </td></tr>

   ${body}

   <!-- Locked footer — unsubscribe is legally required -->
   <tr><td style="padding:34px 40px 36px;border-top:1px solid ${RULE};">
     <p style="margin:0;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">One Step Closer · At Magdala</p>
     <p style="margin:10px 0 0;font-family:${SANS};font-size:13px;line-height:1.6;color:${MUTED};">
       Magdala · Sea of Galilee<br>onestepcloser.org
     </p>
     <p style="margin:16px 0 0;font-family:${SANS};font-size:11px;color:#9aa0a6;">
       You're receiving this because you're part of One Step Closer.
       <a href="{{unsubscribe}}" style="color:#9aa0a6;">Unsubscribe</a>
     </p>
   </td></tr>

  </table>
 </td></tr>
</table>
</body></html>`;
}

// Spam filters punish HTML-only mail — every send needs this alongside.
export function renderPlainText(draft: EmailDraft): string {
  const lines: string[] = [draft.subject, ""];
  for (const b of draft.blocks) {
    if (b.kind === "heading" || b.kind === "text") lines.push(b.text.replace(/[*_]/g, ""), "");
    if (b.kind === "button") lines.push(`${b.label}: ${b.href}`, "");
    if (b.kind === "scripture") lines.push(`"${b.text}" — ${b.reference}`, "");
    if (b.kind === "sermon") lines.push(`Featured film: ${FEATURED.title} (${FEATURED.part})`, FEATURED.href, "");
    if (b.kind === "events") {
      lines.push("Coming up:");
      upcomingEvents().slice(0, b.count).forEach((e) => lines.push(`- ${e.title} — ${e.cadence ?? e.dateLabel}, ${e.time}`));
      lines.push("");
    }
    if (b.kind === "mission") lines.push("The Restaurant Built Together — a house on the shore at Magdala where Christians of every tradition sit at one table.", "");
  }
  lines.push("---", "One Step Closer · Magdala, Sea of Galilee", "onestepcloser.org", "Unsubscribe: {{unsubscribe}}");
  return lines.join("\n");
}

export const STARTER: EmailDraft = {
  subject: "This week at Magdala",
  preheader: "Sunday's message, what's coming up, and a word for your week.",
  blocks: [
    { id: "s1", kind: "heading", text: "This week at Magdala", align: "left" },
    { id: "s2", kind: "text", text: "Friends — a few things worth knowing about as we head into Sunday. We'd love to see you.", align: "left" },
    { id: "s3", kind: "sermon" },
    { id: "s4", kind: "spacer", size: "sm" },
    { id: "s5", kind: "events", count: 3 },
    { id: "s6", kind: "divider" },
    { id: "s7", kind: "scripture", text: "Let us not grow weary of doing good, for in due season we will reap, if we do not give up.", reference: "Galatians 6:9" },
    { id: "s8", kind: "button", label: "See the work", href: "https://onestepcloser.org", align: "left" },
  ],
};
