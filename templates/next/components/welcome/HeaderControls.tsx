"use client";

import { useRef, useState } from "react";
import { ACCENTS } from "./theme";
import { useDismissible } from "./useDismissible";
import { PopoverPanel } from "./PopoverPanel";

const iconBtn =
  "inline-flex size-[39px] shrink-0 cursor-pointer items-center justify-center border border-[var(--line)] bg-transparent transition-[border-color,color] duration-150 hover:border-[var(--acc)] hover:text-[var(--acc)]";

export function AccentPicker({
  accent,
  onPick,
}: {
  accent: string;
  onPick: (color: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  useDismissible(open, () => setOpen(false), wrapRef);

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Accent color"
        aria-label="Choose accent color"
        className={iconBtn}
      >
        <span className="inline-block size-4 rounded-full" style={{ background: accent }} />
      </button>
      {open && (
        <PopoverPanel className="right-0 z-30 flex gap-[9px] px-[13px] py-[11px] welcome-sm:right-0">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onPick(c);
                setOpen(false);
              }}
              title={c}
              className="size-6 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-transform duration-150 hover:scale-110"
              style={{
                background: c,
                boxShadow: c === accent ? "0 0 0 2px var(--card), 0 0 0 3.5px var(--ink)" : "none",
              }}
            />
          ))}
        </PopoverPanel>
      )}
    </span>
  );
}

export function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="Toggle light / dark"
      aria-label="Toggle light or dark mode"
      className={`${iconBtn} text-[var(--ink)]`}
    >
      <span className="relative inline-block size-4 overflow-hidden rounded-full border-[1.5px] border-current">
        <span
          className={`absolute top-0 bottom-0 w-1/2 bg-current transition-[left,right] duration-200 ${dark ? "right-0 left-auto" : "left-0 right-auto"}`}
        />
      </span>
    </button>
  );
}

export function HeaderUtilities({
  accent,
  onAccentPick,
  dark,
  onToggleDark,
}: {
  accent: string;
  onAccentPick: (color: string) => void;
  dark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <>
      <AccentPicker accent={accent} onPick={onAccentPick} />
      <ThemeToggle dark={dark} onToggle={onToggleDark} />
    </>
  );
}
