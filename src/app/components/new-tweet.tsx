import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from "./new-tweet.module.css";
import Image from "next/image";

export const dynamic = "force-dynamic";

const NewTweet = ({ user }: { user: User }) => {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    if (user) {
      await supabase.from("tweets").insert({ title, user_id: user.id });
    }
  };

  return (
    <form className={styles.form} action={addTweet}>
      <div className={styles.field}>
        <div className={styles.image}>
          <Image src={user.user_metadata.avatar_url} alt="user avatar" width={48} height={48} className={styles.img} />
        </div>
        <input className={styles.input} name="title" placeholder="What is happening?" />
      </div>
    </form>
  );
};

export default NewTweet;
