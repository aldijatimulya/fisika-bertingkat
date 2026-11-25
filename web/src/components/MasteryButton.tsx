"use client";
import { MASTERY_LABEL, NEXT, setMastery, useMasteryStore } from "@/lib/mastery";

export function MasteryButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const store = useMasteryStore();
  const s = store[id] ?? "belum";
  return (
    <button
      type="button"
      className="mastery"
      data-s={s}
      onClick={() => setMastery(id, NEXT[s])}
      aria-label={`Status pemahaman: ${MASTERY_LABEL[s]}. Klik untuk mengubah.`}
      title="Klik untuk mengubah status"
    >
      <span className="dot" aria-hidden />
      {compact ? null : MASTERY_LABEL[s]}
    </button>
  );
}
