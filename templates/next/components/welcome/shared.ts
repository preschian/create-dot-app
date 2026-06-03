import { CLI } from "./data";

export type WriteActionKey = "flip" | "remark";

export const WRITE_STEPS = ["Ready", "Broadcast", "InBlock", "Finalized"] as const;

export const REMARK_MESSAGE = `gm from ${CLI}`;

export const WRITE_ACTIONS = {
  flip: {
    key: "flip" as WriteActionKey,
    tab: "flipper.flip",
    title: "Call the flipper contract",
    cta: "Call contract",
  },
  remark: {
    key: "remark" as WriteActionKey,
    tab: "system.remark",
    title: "Submit a sample extrinsic",
    cta: "Send extrinsic",
  },
} as const;

export const EYEBROW =
  "font-mono text-[11px] font-semibold tracking-[0.12em] text-(--faint)";

export const LIVE_CELL =
  "p-[26px_30px] welcome-sm:p-[22px_20px]";
