import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function checkAdmin(userId: string) {
    const { data } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", userId)
      .single();
    return !!data;
  }

  useEffect(() => {
    let mounted = true;
    const sessionTimeout = new Promise<{ data: { session: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { session: null } }), 12_000)
    );
    Promise.race([supabase.auth.getSession(), sessionTimeout]).then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // IMPORTANT: Avoid any async Supabase calls inside this handler.
        // Some supabase-js versions can deadlock if you do DB calls here, which then makes
        // the next Supabase call (e.g. a second login) hang.
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function resolveAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      try {
        const admin = await checkAdmin(user.id);
        if (!ignore) setIsAdmin(admin);
      } catch {
        if (!ignore) setIsAdmin(false);
      }
    }

    resolveAdmin();
    return () => { ignore = true; };
  }, [user?.id]);

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      const admin = await checkAdmin(data.user.id);
      if (!admin) {
        await supabase.auth.signOut();
        return { error: "Access denied. Not an admin." };
      }
      setIsAdmin(true);
    }
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
