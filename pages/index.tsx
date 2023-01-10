import Head from "next/head";
import { useState } from "react";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [date, setDate] = useState<Date>(() => new Date());

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav>
          <button>←</button>
          {date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
          <button>→</button>
        </nav>
        <div className={styles.calendar}>
          <div className={styles.day}>1</div>
          <div className={styles.day}>2</div>
          <div className={styles.day}>3</div>
          {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, i) => (
            <div key={i} className={styles.day}>
              {i + 1}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
