"use client";

import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styles from "./button.module.css";

const AuthButtonClient = ({ session }: { session: Session | null }) => {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <button className={styles.button} onClick={handleSignOut}>
      Logout
    </button>
  ) : (
    <button className={styles.button} onClick={handleSignIn}>
      Login
    </button>
  );
};

export default AuthButtonClient;
