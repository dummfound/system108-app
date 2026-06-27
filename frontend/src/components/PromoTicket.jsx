import { useEffect, useRef, useState } from "react";
import styles from "./PromoTicket.module.scss";

const KRUTO_TICKET_URL = "https://krutofestival.com/#event/2641206";
const COUNTDOWN_SECONDS = 10;
const STORAGE_KEY = "system108-promo-ticket";

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

function readPromoState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePromoState(patch) {
  const next = { ...readPromoState(), ...patch };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function createInitialState() {
  const saved = readPromoState();
  const startedAt = saved?.startedAt ?? Date.now();

  if (!saved?.startedAt) {
    writePromoState({ startedAt });
  }

  if (saved?.dismissed) {
    return {
      entered: true,
      dismissed: true,
      secondsLeft: 0,
    };
  }

  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const secondsLeft = Math.max(0, COUNTDOWN_SECONDS - elapsed);

  return {
    entered: Boolean(saved?.entered || elapsed >= 1),
    dismissed: false,
    secondsLeft,
  };
}

export function PromoTicket({ onOpenLink }) {
  const initial = useRef(createInitialState()).current;
  const [entered, setEntered] = useState(initial.entered);
  const [dismissed, setDismissed] = useState(initial.dismissed);
  const [secondsLeft, setSecondsLeft] = useState(initial.secondsLeft);

  const canClose = secondsLeft === 0;

  useEffect(() => {
    if (entered) return undefined;

    const enterTimer = window.setTimeout(() => {
      setEntered(true);
      writePromoState({ entered: true });
    }, 400);

    return () => window.clearTimeout(enterTimer);
  }, [entered]);

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
            onClick={() => {
              setDismissed(true);
              writePromoState({ dismissed: true, entered: true });
            }}
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
