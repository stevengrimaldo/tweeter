import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import AuthButtonClient from "../components/auth-button-client";
import GitHubButton from "./github-button";

export const dynamic = "force-dynamic";

const Login = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div>
      <GitHubButton />
    </div>
  );
};

export default Login;
