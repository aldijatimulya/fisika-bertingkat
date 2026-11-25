"use client";
import { useSyncExternalStore } from "react";
import { mergeStores, type MasteryRemote, type MasteryMap, type Status } from "./sync";

// Sumber utama di peramban = localStorage. Jika pengguna login, setiap perubahan juga dikirim ke Supabase.
export type Mastery = Status;
export type SyncState = "lokal" | "menyinkronkan" | "tersinkron" | "gagal";
const KEY = "fisika.mastery.v1";
type Store = MasteryMap;

let cache: Store | null = null;
let remote: MasteryRemote | null = null;
let syncState: SyncState = "lokal";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function read(): Store {
  if (cache) return cache;
  try { cache = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { cache = {}; }
  return cache!;
}
function write(next: Store) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* penyimpanan diblokir: tetap di memori */ }
  emit();
}
function setSync(s: SyncState) { syncState = s; emit(); }

const EMPTY: Store = {};
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
export function useMasteryStore(): Store { return useSyncExternalStore(subscribe, read, () => EMPTY); }
export function useSyncState(): SyncState { return useSyncExternalStore(subscribe, () => syncState, () => "lokal" as SyncState); }

async function push(upserts: { id: string; status: Status }[], removals: string[]) {
  if (!remote) return;
  setSync("menyinkronkan");
  try {
    await remote.upsert(upserts);
    await remote.remove(removals);
    setSync("tersinkron");
  } catch { setSync("gagal"); }   // data tetap aman di lokal; akan dikirim ulang pada perubahan/login berikutnya
}

export function setMastery(id: string, status: Mastery) { setManyMastery([id], status); }
export function setManyMastery(ids: string[], status: Mastery) {
  const next = { ...read() };
  for (const id of ids) { if (status === "belum") delete next[id]; else next[id] = status; }
  write(next);
  void (status === "belum" ? push([], ids) : push(ids.map((id) => ({ id, status })), []));
}

/** Dipanggil saat login: tarik data akun, gabungkan dengan data lokal, unggah yang hanya ada di lokal. */
export async function attachRemote(r: MasteryRemote) {
  remote = r;
  setSync("menyinkronkan");
  try {
    const { merged, toPush } = mergeStores(read(), await r.fetchAll());
    write(merged);
    if (toPush.length) await r.upsert(toPush);
    setSync("tersinkron");
  } catch { setSync("gagal"); }
}
/** Dipanggil saat keluar: lepas koneksi dan hapus cache lokal agar tidak terbaca pengguna berikutnya di perangkat bersama. */
export function detachRemote(clearLocal: boolean) {
  remote = null;
  if (clearLocal) write({});
  setSync("lokal");
}

export const NEXT: Record<Mastery, Mastery> = { belum: "sebagian", sebagian: "kuasai", kuasai: "belum" };
export const MASTERY_LABEL: Record<Mastery, string> = { belum: "Belum dipelajari", sebagian: "Sebagian paham", kuasai: "Sudah paham" };
