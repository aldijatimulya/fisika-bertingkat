import Link from "next/link";
import { equationById, nodeById } from "@/lib/data";

/** Ubah rujukan internal (eq.xxx atau id konsep) di dalam teks menjadi tautan dengan judul yang mudah dibaca. */
export function Linked({ text }: { text: string }) {
  const parts = text.split(/(\b[a-z0-9]{1,6}\.[a-z0-9_]+\b)/g);
  return (
    <>
      {parts.map((p, i) => {
        const eq = equationById.get(p);
        if (eq) return <Link key={i} href={`/persamaan/${eq.id}/`}>{eq.title}</Link>;
        const c = nodeById.get(p);
        if (c) return <Link key={i} href={`/konsep/${c.id}/`}>{c.title}</Link>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
