"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BLOCK_LIBRARY, STARTER, newBlock, renderEmail,
  type Block, type BlockKind, type EmailDraft,
} from "../../lib/email";

/*
  EmailComposer — block-based, so it's impossible to send something ugly or
  broken. Structure and styling stay locked to One Step Closer's system; Fr. Eamon
  controls the words, the order, and which blocks appear.

  Live-data blocks (film, gatherings, mission) fill themselves from the workspace,
  which is the thing Mailchimp can't do for them.

  Preview is rendered by the same function that produces the sent email, so
  what he sees is genuinely what arrives.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

export default function EmailComposer({
  onBack,
  recipients,
}: {
  onBack: () => void;
  recipients: number;
}) {
  const [draft, setDraft] = useState<EmailDraft>(STARTER);
  const [selected, setSelected] = useState<string | null>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [showAdd, setShowAdd] = useState(false);

  const html = useMemo(
    () => renderEmail(draft, typeof window !== "undefined" ? window.location.origin : ""),
    [draft],
  );

  const block = draft.blocks.find((b) => b.id === selected) ?? null;

  const update = (id: string, patch: Partial<Block>) =>
    setDraft((d) => ({
      ...d,
      blocks: d.blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)),
    }));

  const add = (kind: BlockKind) => {
    const b = newBlock(kind);
    setDraft((d) => ({ ...d, blocks: [...d.blocks, b] }));
    setSelected(b.id);
    setShowAdd(false);
  };

  const move = (id: string, dir: -1 | 1) =>
    setDraft((d) => {
      const i = d.blocks.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= d.blocks.length) return d;
      const blocks = [...d.blocks];
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      return { ...d, blocks };
    });

  const remove = (id: string) => {
    setDraft((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }));
    setSelected(null);
  };

  return (
    <div>
      {/* Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2a1c14]/50 transition-colors hover:text-[#2a1c14]"
        >
          <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
            <path d="M6 1 1 6l5 5M1 6h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to compose
        </button>

        <div className="flex items-center gap-2">
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`rounded-full px-4 py-2 text-[10.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                device === d ? "bg-[#54132e] text-white" : "text-[#2a1c14]/45 hover:text-[#2a1c14]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Subject + preheader */}
      <div className="mt-6 rounded-[6px] border border-[#2a1c14]/10 bg-white p-7">
        <label className="block">
          <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/45">
            Subject
          </span>
          <input
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
            className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-2 text-[17px] text-[#2a1c14] outline-none transition-colors focus:border-[#54132e]"
          />
        </label>
        <label className="mt-6 block">
          <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/45">
            Preheader
          </span>
          <input
            value={draft.preheader}
            onChange={(e) => setDraft({ ...draft, preheader: e.target.value })}
            className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-2 text-[14px] text-[#2a1c14]/75 outline-none transition-colors focus:border-[#54132e]"
          />
          <span className="mt-2 block text-[11.5px] text-[#2a1c14]/40">
            The grey line beside the subject in the inbox. Most people never set it — it changes open rates more than the subject does.
          </span>
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left: blocks + inspector */}
        <div className="space-y-4">
          <div className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/45">
                Blocks
              </p>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="rounded-full bg-[#54132e] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#3f0e22]"
              >
                + Add
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {draft.blocks.map((b, i) => {
                const meta = BLOCK_LIBRARY.find((x) => x.kind === b.kind);
                const on = selected === b.id;
                return (
                  <div
                    key={b.id}
                    className={`group flex items-center gap-2 rounded-[4px] px-3 py-2 transition-colors ${
                      on ? "bg-[#54132e] text-white" : "hover:bg-[#2a1c14]/5"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(b.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className={`block truncate text-[12.5px] ${on ? "text-white" : "text-[#2a1c14]/75"}`}>
                        {meta?.label ?? b.kind}
                      </span>
                      {meta?.live && (
                        <span className={`text-[9px] uppercase tracking-[0.14em] ${on ? "text-white/50" : "text-[#a06a1a]"}`}>
                          Auto-fills
                        </span>
                      )}
                    </button>
                    <span className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <IconBtn on={on} label="Move up" disabled={i === 0} onClick={() => move(b.id, -1)}>
                        <path d="M6 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </IconBtn>
                      <IconBtn on={on} label="Move down" disabled={i === draft.blocks.length - 1} onClick={() => move(b.id, 1)}>
                        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </IconBtn>
                      <IconBtn on={on} label="Delete" onClick={() => remove(b.id)}>
                        <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </IconBtn>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inspector */}
          <AnimatePresence mode="wait">
            {block && (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-[6px] border border-[#2a1c14]/10 bg-white p-5"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/45">
                  {BLOCK_LIBRARY.find((x) => x.kind === block.kind)?.label}
                </p>
                <div className="mt-4 space-y-4">
                  <Inspector block={block} update={update} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: live preview, rendered by the real send function */}
        <div className="rounded-[6px] border border-[#2a1c14]/10 bg-[#f2f1ee] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/45">
              Preview
            </p>
            <p className="text-[11px] text-[#2a1c14]/40">
              Exactly what {recipients} {recipients === 1 ? "person receives" : "people receive"}
            </p>
          </div>
          <div className="flex justify-center">
            <iframe
              title="Email preview"
              srcDoc={html}
              style={{ width: device === "mobile" ? 380 : "100%", maxWidth: 680, height: 720 }}
              className="rounded-[3px] border border-[#2a1c14]/10 bg-white transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Add-block sheet */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)}
              className="fixed inset-0 z-40 bg-black/30"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed left-1/2 top-1/2 z-50 w-[520px] max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-[6px] bg-white p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.5)]"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#2a1c14]/45">
                Add a block
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {BLOCK_LIBRARY.map((b) => (
                  <button
                    key={b.kind}
                    type="button"
                    onClick={() => add(b.kind)}
                    className="rounded-[4px] border border-[#2a1c14]/12 px-4 py-3 text-left transition-colors hover:border-[#2a1c14]/40 hover:bg-[#2a1c14]/4"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] text-[#2a1c14]">{b.label}</span>
                      {b.live && (
                        <span className="rounded-full border border-[#b19277]/50 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.14em] text-[#a06a1a]">
                          Live
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#2a1c14]/45">{b.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- inspector fields per block ---------- */

function Inspector({
  block, update,
}: {
  block: Block;
  update: (id: string, patch: Partial<Block>) => void;
}) {
  const u = (patch: Partial<Block>) => update(block.id, patch);

  switch (block.kind) {
    case "heading":
    case "text":
      return (
        <>
          <Field label="Text" area value={block.text} onChange={(v) => u({ text: v } as Partial<Block>)} />
          <AlignPicker value={block.align} onChange={(v) => u({ align: v } as Partial<Block>)} />
          <Hint>**bold** · _italic_ · [link](https://…)</Hint>
        </>
      );
    case "button":
      return (
        <>
          <Field label="Label" value={block.label} onChange={(v) => u({ label: v } as Partial<Block>)} />
          <Field label="Link" value={block.href} onChange={(v) => u({ href: v } as Partial<Block>)} />
          <AlignPicker value={block.align} onChange={(v) => u({ align: v } as Partial<Block>)} />
        </>
      );
    case "image":
      return (
        <>
          <Field label="Image path" value={block.src} onChange={(v) => u({ src: v } as Partial<Block>)} />
          <Field label="Alt text" value={block.alt} onChange={(v) => u({ alt: v } as Partial<Block>)} />
          <Hint>Uploads land here once storage is wired.</Hint>
        </>
      );
    case "scripture":
      return (
        <>
          <Field label="Verse" area value={block.text} onChange={(v) => u({ text: v } as Partial<Block>)} />
          <Field label="Reference" value={block.reference} onChange={(v) => u({ reference: v } as Partial<Block>)} />
        </>
      );
    case "spacer":
      return (
        <div className="flex gap-1.5">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s} type="button" onClick={() => u({ size: s } as Partial<Block>)}
              className={`flex-1 rounded-full px-3 py-2 text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors ${
                block.size === s ? "bg-[#54132e] text-white" : "border border-[#2a1c14]/15 text-[#2a1c14]/55"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      );
    case "events":
      return (
        <div className="flex gap-1.5">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n} type="button" onClick={() => u({ count: n } as Partial<Block>)}
              className={`flex-1 rounded-full px-3 py-2 text-[11px] font-medium transition-colors ${
                block.count === n ? "bg-[#54132e] text-white" : "border border-[#2a1c14]/15 text-[#2a1c14]/55"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      );
    default:
      return (
        <p className="text-[12.5px] leading-relaxed text-[#2a1c14]/50">
          This block fills itself from the workspace — nothing to set.
        </p>
      );
  }
}

/* ---------- bits ---------- */

function Field({
  label, value, onChange, area,
}: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-[#2a1c14]/40">{label}</span>
      {area ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)} rows={4}
          className="w-full resize-none rounded-[3px] border border-[#2a1c14]/15 bg-transparent p-2.5 text-[13px] leading-relaxed text-[#2a1c14] outline-none focus:border-[#54132e]"
        />
      ) : (
        <input
          value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border-b border-[#2a1c14]/20 bg-transparent pb-1.5 text-[13px] text-[#2a1c14] outline-none focus:border-[#54132e]"
        />
      )}
    </label>
  );
}

function AlignPicker({ value, onChange }: { value: "left" | "center"; onChange: (v: "left" | "center") => void }) {
  return (
    <div className="flex gap-1.5">
      {(["left", "center"] as const).map((a) => (
        <button
          key={a} type="button" onClick={() => onChange(a)}
          className={`flex-1 rounded-full px-3 py-2 text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors ${
            value === a ? "bg-[#54132e] text-white" : "border border-[#2a1c14]/15 text-[#2a1c14]/55"
          }`}
        >
          {a}
        </button>
      ))}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] leading-relaxed text-[#2a1c14]/40">{children}</p>;
}

function IconBtn({
  children, label, onClick, disabled, on,
}: {
  children: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; on?: boolean;
}) {
  return (
    <button
      type="button" aria-label={label} onClick={onClick} disabled={disabled}
      className={`rounded p-1 transition-colors disabled:opacity-20 ${
        on ? "text-white/60 hover:text-white" : "text-[#2a1c14]/40 hover:text-[#2a1c14]"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">{children}</svg>
    </button>
  );
}
