import Head from "next/head";
import { useState } from "react";

import styles from "../styles/Home.module.css";

interface Event {
  id: string;
  // date: Date;
  title: string;
}

type Schedule = Map<string, Map<string, Event>>;

export default function Home() {
  const [date, setDate] = useState<Date>(() => new Date());
  const [schedule, setSchedule] = useState<Schedule>(() => new Map());

  const diasSemana = ['Domingo','Lunes','Martes','Miércoles', 'Jueves','Viernes','Sábado']

  function handleMonthChange(offset: number) {
    const draft = new Date(date);
    draft.setMonth(date.getMonth() + offset);
    setDate(draft);
  }

  function handleNewEvent(key: string) {
    const draft = new Map(schedule);

    if (!draft.has(key)) {
      draft.set(key, new Map());
    }

    const day = draft.get(key);
    const id = String(Date.now());
    const title = window.prompt("Event title");

    if (!title) return;

    day?.set(id, {
      id,
      title,
    });

    setSchedule(draft);
  }

  function handleDeleteEvent(key: string, id: string) {
    const draft = new Map(schedule);
    const day = draft.get(key)!;

    day.delete(id);
    setSchedule(draft);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>CookUnity Challenge</title>
        <meta name="description" content="CookUnity description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className={styles.nav}>
          <button onClick={() => handleMonthChange(-1)}>←</button>
          {date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
          <button onClick={() => handleMonthChange(1)}>→</button>
          {/* <button onClick={() => setDate(new Date())}>TODAY</button> */}
        </nav>
        <div className={styles.calendar}>
          {diasSemana.map((dia, i) => (
            <div key={i}>
              {dia}
            </div>
          ))}
          
          {Array.from({ length: (new Date(date.getFullYear(),date.getMonth(),1)).getDay() }, (_, i) => (
            <div key={i} className={styles.day}>
            </div>
          ))}

          {Array.from(
            {
              length: new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
              ).getDate(),
            },
            (_, i) => {
              const key = `${date.getFullYear()}/${date.getMonth() + 1}/${
                i + 1
              }`;
              const events = schedule.get(key);

              return (
                <div
                  onClick={() => handleNewEvent(key)}
                  key={i}
                  className={styles.day}
                >
                  {i + 1}
                  {events && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {Array.from(events.values()).map((event) => (
                        <div
                          style={{
                            backgroundColor: "#333",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(key, event.id);
                          }}
                          key={event.id}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
}
