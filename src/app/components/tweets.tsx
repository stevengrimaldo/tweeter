"use client";
import Likes from "./likes";
import { useEffect, experimental_useOptimistic as useOptimistic } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styles from "./tweets.module.css";
import Image from "next/image";

const Tweets = ({ tweets }: { tweets: TweetWithAuthor[] }) => {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
    tweets,
    (currentOptimisticTweets, newTweet) => {
      const newOptimisticTweets = [...currentOptimisticTweets];
      const index = newOptimisticTweets.findIndex((tweet) => tweet.id === newTweet.id);
      newOptimisticTweets[index] = newTweet;
      return newOptimisticTweets;
    }
  );

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    console.log(optimisticTweets);
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, optimisticTweets]);

  return optimisticTweets.map((tweet) => (
    <div key={tweet.id} className={styles.tweet}>
      <div className={styles.image}>
        <Image
          className={styles.img}
          src={JSON.parse(tweet.author.avatar_url)}
          alt="tweet user avatar"
          width={48}
          height={48}
        />
      </div>
      <div className={styles.content}>
        <p>
          <span className={styles.name}>{JSON.parse(tweet.author.name)}</span>{" "}
          <span className={styles.user}>{JSON.parse(tweet.author.username)}</span>
        </p>
        <p className={styles.tweet}>{tweet.title}</p>
        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </div>
    </div>
  ));
};

export default Tweets;
