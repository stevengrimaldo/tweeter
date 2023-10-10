import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthButtonServer from "./components/auth-button-server";
import NewTweet from "./components/new-tweet";
import Tweets from "./components/tweets";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const Home = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_liked_tweet: !!tweet.likes.find((like: { user_id: string }) => like.user_id === session.user.id),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={session.user} />
      <pre>
        <Tweets tweets={tweets} />
      </pre>
    </div>
  );
};

export default Home;
