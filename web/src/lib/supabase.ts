import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { MasteryMap, MasteryRemote, Status } from "./sync";
import { VALID } from "./sync";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // kunci anon/publishable: aman di peramban karena dibatasi RLS

/** true bila variabel lingkungan Supabase diisi. Bila false, aplikasi berjalan dalam mode lokal. */
export const supabaseEnabled = Boolean(URL && KEY);

let client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!client) client = createClient(URL!, KEY!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return client;
}

/** Adaptor tabel public.user_mastery untuk satu pengguna. RLS memastikan hanya baris miliknya yang terbaca/tertulis. */
export function masteryRemote(sb: SupabaseClient, userId: string): MasteryRemote {
  return {
    async fetchAll() {
      const { data, error } = await sb.from("user_mastery").select("concept_id,status");
      if (error) throw error;
      const out: MasteryMap = {};
      for (const r of data ?? []) if (VALID.has(r.status) && r.status !== "belum") out[r.concept_id] = r.status as Status;
      return out;
    },
    async upsert(rows) {
      if (!rows.length) return;
      const now = new Date().toISOString();
      const payload = rows.map((r) => ({ user_id: userId, concept_id: r.id, status: r.status, updated_at: now }));
      for (let i = 0; i < payload.length; i += 500) {
        const { error } = await sb.from("user_mastery").upsert(payload.slice(i, i + 500), { onConflict: "user_id,concept_id" });
        if (error) throw error;
      }
    },
    async remove(ids) {
      if (!ids.length) return;
      const { error } = await sb.from("user_mastery").delete().eq("user_id", userId).in("concept_id", ids);
      if (error) throw error;
    },
  };
}
