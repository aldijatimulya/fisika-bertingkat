// Logika sinkronisasi murni (tanpa React/Supabase) agar mudah diuji.
export type Status = "belum" | "sebagian" | "kuasai";
export type MasteryMap = Record<string, Status>;

/** Penghubung ke penyimpanan jarak jauh (Supabase). */
export interface MasteryRemote {
  fetchAll(): Promise<MasteryMap>;
  upsert(rows: { id: string; status: Status }[]): Promise<void>;
  remove(ids: string[]): Promise<void>;
}

/**
 * Gabungkan data lokal (mis. dikerjakan sebelum login) dengan data akun.
 * - Konflik: data akun menang (sumber kebenaran lintas perangkat).
 * - Yang hanya ada di lokal: ikut diunggah (progres sebelum login tidak hilang).
 */
export function mergeStores(local: MasteryMap, remote: MasteryMap) {
  const merged: MasteryMap = { ...local, ...remote };
  const toPush = Object.keys(local)
    .filter((id) => !(id in remote))
    .map((id) => ({ id, status: local[id] }));
  return { merged, toPush };
}

export const VALID: ReadonlySet<string> = new Set(["belum", "sebagian", "kuasai"]);
