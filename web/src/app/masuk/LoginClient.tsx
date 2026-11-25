"use client";
import Link from "next/link";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

type Msg = { t: "ok" | "error"; text: string } | null;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function explain(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email atau kata sandi salah, atau email belum dikonfirmasi. Periksa kotak masuk Anda.";
  if (m.includes("rate limit")) return "Terlalu banyak email dikirim dalam waktu singkat. Tunggu beberapa menit, atau masuk dengan kata sandi.";
  if (m.includes("already registered")) return "Email ini sudah terdaftar. Pilih Masuk, atau gunakan tautan email.";
  if (m.includes("password should be")) return "Kata sandi terlalu pendek. Gunakan minimal 8 karakter.";
  return message;
}

export function LoginClient() {
  const { enabled, email: current, signOut } = useAuth();
  const [mode, setMode] = useState<"link" | "password">("link");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg>(null);

  if (!enabled) {
    return (
      <div className="wrap narrow" style={{ paddingBottom: 80 }}>
        <div className="page-head"><h1>Masuk belum diaktifkan</h1></div>
        <div className="notice" data-t="error">
          Situs ini berjalan tanpa akun: status paham tersimpan hanya di peramban ini. Untuk mengaktifkan akun, isi
          <code> NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> lalu build ulang (lihat PANDUAN.md).
        </div>
      </div>
    );
  }
  if (current) {
    return (
      <div className="wrap narrow" style={{ paddingBottom: 80 }}>
        <div className="page-head"><h1>Anda sudah masuk</h1><p className="muted" style={{ marginTop: 16 }}>{current}</p></div>
        <div className="actions ui"><Link className="btn" href="/jalur/">Lanjutkan jalur belajar</Link><button className="btn ghost" onClick={() => void signOut()}>Keluar</button></div>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase(); if (!sb) return;
    setBusy(true); setMsg(null);
    try {
      if (mode === "link") {
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${basePath}/masuk/` } });
        if (error) throw error;
        setMsg({ t: "ok", text: "Tautan masuk sudah dikirim. Buka email Anda dan klik tautannya di perangkat ini." });
      } else if (signup) {
        const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${basePath}/masuk/` } });
        if (error) throw error;
        setMsg({ t: "ok", text: data.session ? "Akun dibuat dan Anda sudah masuk." : "Akun dibuat. Konfirmasi dulu lewat email yang kami kirim, lalu masuk." });
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMsg({ t: "error", text: explain(err instanceof Error ? err.message : String(err)) });
    } finally { setBusy(false); }
  }

  return (
    <div className="wrap narrow" style={{ paddingBottom: 80 }}>
      <div className="page-head">
        <h1>Masuk</h1>
        <p className="muted" style={{ marginTop: 16 }}>Dengan akun, status paham Anda tersimpan di semua perangkat. Progres yang sudah Anda tandai sebelum masuk ikut tersimpan.</p>
      </div>
      <div className="tabs" role="group" aria-label="Cara masuk">
        <button type="button" aria-pressed={mode === "link"} onClick={() => { setMode("link"); setMsg(null); }}>Tautan email</button>
        <button type="button" aria-pressed={mode === "password"} onClick={() => { setMode("password"); setMsg(null); }}>Kata sandi</button>
      </div>
      <form onSubmit={submit} className="ui" style={{ display: "grid", gap: 16, maxWidth: 420, marginTop: 24 }}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" style={{ width: "100%" }} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {mode === "password" && (
          <div className="field">
            <label htmlFor="pw">Kata sandi (minimal 8 karakter)</label>
            <input id="pw" className="input" style={{ width: "100%" }} type="password" required minLength={8} autoComplete={signup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center" }}>
              <input type="checkbox" checked={signup} onChange={(e) => setSignup(e.target.checked)} /> Saya belum punya akun
            </label>
          </div>
        )}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Memproses…" : mode === "link" ? "Kirim tautan masuk" : signup ? "Buat akun" : "Masuk"}
        </button>
        {msg && <div className="notice" data-t={msg.t} role="status">{msg.text}</div>}
      </form>
    </div>
  );
}
