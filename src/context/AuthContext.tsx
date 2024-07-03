import React from "react";
import { AuthError, Session, User, WeakPassword } from "@supabase/supabase-js";
import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";
import { Loader2 } from "lucide-react";

type authContextType = {
  user: null | User;
  signIn?: (
    email: string,
    password: string
  ) => Promise<{
    data:
      | {
          user: User;
          session: Session;
          weakPassword?: WeakPassword | undefined;
        }
      | {
          user: null;
          session: null;
          weakPassword?: null | undefined;
        };
    error: AuthError | null;
  }>;
  signOut?: () => Promise<{
    error: AuthError | null;
  }>;
};

const AuthContext = createContext<authContextType>({
  user: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {!loading ? (
        children
      ) : (
        <div className="h-full flex items-center justify-center">
          <Loader2 size={100} className="animate-spin" />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
