"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, masteryRemote, supabaseEnabled } from "@/lib/supabase";
import { attachRemote, detachRemote } from "@/lib/mastery";

type Ctx = { enabled: boolean; ready: boolean; email: string | null; signOut: () => Promise<void> };
const AuthCtx = createContext<Ctx>({ enabled: false, ready: true, email: null, signOut: async () => {} });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!supabaseEnabled);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let lastUser: string | null = null;
    const apply = (s: Session | null) => {
      setSession(s);
      setReady(true);
      const uid = s?.user.id ?? null;
      if (uid === lastUser) return;      // abaikan refresh token yang tidak mengganti pengguna
      if (uid) void attachRemote(masteryRemote(sb, uid));
      else if (lastUser) detachRemote(true);
      lastUser = uid;
    };
    sb.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => apply(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => { await getSupabase()?.auth.signOut(); };
  return <AuthCtx.Provider value={{ enabled: supabaseEnabled, ready, email: session?.user.email ?? null, signOut }}>{children}</AuthCtx.Provider>;
}
