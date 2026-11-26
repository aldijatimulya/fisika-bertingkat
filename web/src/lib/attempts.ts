import { getSupabase } from "./supabase";

/** Catat satu jawaban kuis ke tabel attempts (hanya bila pengguna login). Gagal = diabaikan, tidak mengganggu belajar. */
export async function logAttempt(conceptId: string, correct: boolean, tag?: string) {
  try {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;
    await sb.from("attempts").insert({ user_id: uid, concept_id: conceptId, kind: "kuis_konsep", correct, misconception_tag: tag ?? null });
  } catch { /* abaikan */ }
}
