import Head from "next/head";
import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";

interface Event {
  id: string;
  // date: Date;
  title: string;
}

type Schedule = Map<string, Map<string, Event>>;

/**
 * Local Storage
 */
function obtenerMapStorage(json_storage: string) {
  const draft = new Map();

  const json_storage_0 = json_storage[0];

  for (let js_st in json_storage_0) {
    draft.set(js_st, new Map());

    const subMap = json_storage_0[js_st];
    for (let js in subMap) {
      const day = draft.get(js_st);

      const event_map = subMap[js];
      const id = event_map[0];
      const title = event_map[1]["title"];

      day.set(id, {
        id,
        title,
      });
    }
  }

  return draft;
}
/**
 * Local Storage
 */

export default function Home() {
  const [date, setDate] = useState<Date>(() => new Date());
  const [schedule, setSchedule] = useState<Schedule>(() => new Map());

  /**
   * Local Storage
   */
  useEffect(() => {
    const json_storage = JSON.parse(
      "[" + localStorage.getItem("schedule") + "]"
    );

    setSchedule(obtenerMapStorage(json_storage));
  }, []);
  /**
   * Local Storage
   */

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

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

    guardarLocalStorage(draft);
  }

  function handleDeleteEvent(key: string, id: string) {
    const draft = new Map(schedule);
    const day = draft.get(key)!;

    day.delete(id);
    setSchedule(draft);

    guardarLocalStorage(draft);
  }

  function guardarLocalStorage(draft: Schedule) {
    const draftObj = Object.fromEntries(draft);
    
    const draftSoloObj = new Array();

    for (let obj in draftObj) {
      const draftInterno = draftObj[obj];
      const draftInternoObject = Object.entries(
        Object.fromEntries(draftInterno)
      );

      draftSoloObj[obj] = draftInternoObject;
    }

    const json_locale_storage = JSON.stringify(Object.assign({}, draftSoloObj));
    window.localStorage.setItem("schedule", json_locale_storage);
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
        </nav>
        <button className={styles.nav} onClick={() => setDate(new Date())}>
          TODAY
        </button>
        <div className={styles.calendar}>
          {diasSemana.map((dia, i) => (
            <div key={i}>{dia}</div>
          ))}

          {Array.from(
            {
              length: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
            },
            (_, i) => (
              <div key={i} className={styles.day}></div>
            )
          )}

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

              const clasesDiv =
                i + 1 === date.getDate() &&
                date.getMonth() === new Date().getMonth()
                  ? `${styles.day} ${styles.dayToday}`
                  : `${styles.day}`;

              return (
                <div
                  onClick={() => handleNewEvent(key)}
                  key={i}
                  className={clasesDiv}
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

          {Array.from(
            {
              length:
                (new Date(date.getFullYear(), date.getMonth(), 1).getDay() < 6
                  ? 35
                  : 42) -
                (new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate() +
                  new Date(date.getFullYear(), date.getMonth(), 1).getDay()),
            },
            (_, i) => (
              <div key={i} className={styles.day}></div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
