import { LEVELS } from "@/lib/data";
export function Level({ level, full = false }: { level: number; full?: boolean }) {
  return (
    <span className="lv" style={{ ["--c" as string]: `var(--lv${level})` }}>
      L{level} {full ? LEVELS[level].name : LEVELS[level].short}
    </span>
  );
}
