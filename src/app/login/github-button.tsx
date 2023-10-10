"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const GitHubButton = () => {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return <button onClick={handleSignIn}>GitHub</button>;
};

export default GitHubButton;
