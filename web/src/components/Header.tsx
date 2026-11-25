"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useSyncState } from "@/lib/mastery";

const NAV = [
  { href: "/peta/", label: "Peta konsep" },
  { href: "/jalur/", label: "Jalur belajar" },
  { href: "/persamaan/", label: "Persamaan" },
];
const SYNC_LABEL = { lokal: "", menyinkronkan: "menyimpan…", tersinkron: "tersimpan", gagal: "gagal menyimpan ke akun" } as const;

export function Header() {
  const path = usePathname() ?? "";
  const { enabled, ready, email, signOut } = useAuth();
  const sync = useSyncState();
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">Fisika <span>bertingkat</span></Link>
        <nav className="nav" aria-label="Utama">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>{n.label}</Link>
          ))}
          {enabled && ready && (email ? (
            <span className="acct">
              <span className="small muted" title={email}>{email}{SYNC_LABEL[sync] ? ` · ${SYNC_LABEL[sync]}` : ""}</span>
              <button type="button" className="btn ghost sm" onClick={() => void signOut()}>Keluar</button>
            </span>
          ) : (
            <Link href="/masuk/" aria-current={path.startsWith("/masuk") ? "page" : undefined}>Masuk</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
