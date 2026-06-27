import { useEffect, useState } from "react";
import styles from "./PromoTicket.module.scss";

const KRUTO_TICKET_URL = "https://krutofestival.com/#event/2641206";
const COUNTDOWN_SECONDS = 10;

function DismissIcon() {
  return (
    <svg className={styles.dismissIcon} viewBox="0 0 12 12" aria-hidden>
      <path
        d="M3 3l6 6M9 3L3 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PromoTicket({ onOpenLink }) {
  const [entered, setEntered] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  const canClose = secondsLeft === 0;

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setEntered(true), 400);
    return () => window.clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  if (dismissed) return null;

  return (
    <aside
      className={`${styles.wrap} ${entered ? styles.wrapVisible : ""}`}
      aria-live="polite"
    >
      <div className={styles.panel}>
        <div className={styles.buyShell}>
          <button
            type="button"
            className={styles.buy}
            onClick={() => onOpenLink(KRUTO_TICKET_URL)}
          >
            КРУТО · билеты
          </button>

          <button
            type="button"
            className={`${styles.dismiss} ${canClose ? styles.dismissReady : ""}`}
            disabled={!canClose}
            onClick={() => setDismissed(true)}
            aria-label={canClose ? "Закрыть" : `Закрыть через ${secondsLeft} секунд`}
          >
            {canClose ? (
              <DismissIcon />
            ) : (
              <span className={styles.dismissCount}>{secondsLeft}</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
