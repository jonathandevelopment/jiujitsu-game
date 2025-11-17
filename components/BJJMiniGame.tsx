"use client";

import { useSettingsDrawer } from "@/components/SettingsDrawerContext";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type Move = "PASS" | "SWEEP" | "SUBMIT";
type RoundOutcome = "win" | "lose" | "timeout";
type ThemeName = "GripState" | "StaticVision";
type BeltColor = "white" | "blue" | "purple" | "brown" | "black";

type ThemeConfig = {
  backgroundClass: string;
  panelBg: string;
  border: string;
  accent: string;
  accentText: string;
  muted: string;
  accentSoft: string;
};

type Settings = {
  sounds: boolean;
  haptics: boolean;
};

type BeltDescriptor = {
  label: string;
  color: BeltColor;
};

type ConfettiPiece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
};

const MOVES: Move[] = ["PASS", "SWEEP", "SUBMIT"];
const COUNTERS: Record<Move, Move> = {
  PASS: "SWEEP",
  SWEEP: "SUBMIT",
  SUBMIT: "PASS",
};

const MOVE_LABEL: Record<Move, string> = {
  PASS: "Pase de guardia",
  SWEEP: "Barrido",
  SUBMIT: "Sumisión",
};

const LABEL_TO_MOVE: Record<string, Move> = {
  "Pase de guardia": "PASS",
  Barrido: "SWEEP",
  Sumisión: "SUBMIT",
};

const MOVE_EMOJI: Record<Move, string> = {
  PASS: "🛡️",
  SWEEP: "🔁",
  SUBMIT: "🥋",
};

const KEY_TO_MOVE: Record<string, Move> = {
  "1": "PASS",
  "2": "SWEEP",
  "3": "SUBMIT",
};

const RULE_RELATIONS = [
  { attack: "Pase de guardia", losesTo: "Barrido" },
  { attack: "Barrido", losesTo: "Sumisión" },
  { attack: "Sumisión", losesTo: "Pase de guardia" },
] as const;
const RULE_ICONS: Record<Move, string> = {
  PASS: "⇄",
  SWEEP: "⇄",
  SUBMIT: "⇄",
};
const HIGH_SCORE_KEY = "bjj-mini-game-high-score";
const START_TIME_MS = 3500;
const MIN_TIME_MS = 2000;

const BELTS: readonly BeltDescriptor[] = [
  { label: "White Belt", color: "white" },
  { label: "Blue Belt", color: "blue" },
  { label: "Purple Belt", color: "purple" },
  { label: "Brown Belt", color: "brown" },
  { label: "Black Belt", color: "black" },
] as const;

const BELT_THEMES: Record<
  BeltColor,
  {
    panelBg: string;
    border: string;
    accent: string;
    text: string;
    buttonBg: string;
    buttonText: string;
    glow: string;
  }
> = {
  white: {
    panelBg: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
    border: "rgba(15,23,42,0.2)",
    accent: "#0f172a",
    text: "#0f172a",
    buttonBg: "#0f172a",
    buttonText: "#f8fafc",
    glow: "0 0 60px rgba(148,163,184,0.35)",
  },
  blue: {
    panelBg: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    border: "rgba(191,219,254,0.6)",
    accent: "#bfdbfe",
    text: "#e0f2ff",
    buttonBg: "#0ea5e9",
    buttonText: "#04111f",
    glow: "0 0 60px rgba(59,130,246,0.45)",
  },
  purple: {
    panelBg: "linear-gradient(135deg,#6d28d9,#a855f7)",
    border: "rgba(233,213,255,0.6)",
    accent: "#f3e8ff",
    text: "#faf5ff",
    buttonBg: "#f3e8ff",
    buttonText: "#4c1d95",
    glow: "0 0 60px rgba(168,85,247,0.45)",
  },
  brown: {
    panelBg: "linear-gradient(135deg,#78350f,#b45309)",
    border: "rgba(253,230,138,0.4)",
    accent: "#fde68a",
    text: "#fff7ed",
    buttonBg: "#fed7aa",
    buttonText: "#6b2f09",
    glow: "0 0 60px rgba(180,83,9,0.45)",
  },
  black: {
    panelBg: "linear-gradient(135deg,#0f0f0f,#262626)",
    border: "rgba(255,255,255,0.2)",
    accent: "#f5f5f5",
    text: "#fafafa",
    buttonBg: "#f5f5f5",
    buttonText: "#090909",
    glow: "0 0 70px rgba(250,250,250,0.3)",
  },
};

const THEMES: Record<ThemeName, ThemeConfig> = {
  GripState: {
    backgroundClass: "bg-neutral-950 text-neutral-100",
    panelBg: "rgba(18,18,18,0.85)",
    border: "rgba(255,255,255,0.08)",
    accent: "#A32C2C",
    accentText: "#fff4f1",
    muted: "#bababa",
    accentSoft: "rgba(163,44,44,0.25)",
  },
  StaticVision: {
    backgroundClass: "bg-black text-neutral-100",
    panelBg: "rgba(5,5,5,0.85)",
    border: "rgba(249,115,22,0.35)",
    accent: "#f97316",
    accentText: "#0a0a0a",
    muted: "#d1d5db",
    accentSoft: "rgba(249,115,22,0.2)",
  },
};

const confettiPalette = ["#A32C2C", "#f97316", "#fef3c7", "#22c55e", "#38bdf8"];

const difficultyForScore = (value: number) => {
  const dec = Math.min(START_TIME_MS - MIN_TIME_MS, value * 20);
  return START_TIME_MS - dec;
};

function getBeltByXp(xp: number): BeltDescriptor {
  const index = Math.min(BELTS.length - 1, Math.floor(xp / 100));
  return BELTS[index];
}

function randomMove(): Move {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function getOutcome(enemy: Move, player: Move | null): RoundOutcome {
  if (!player) return "timeout";
  if (COUNTERS[enemy] === player) return "win";
  return "lose";
}

export interface BJJMiniGameProps {
  theme?: ThemeName;
}

export default function BJJMiniGame({
  theme = "GripState",
}: BJJMiniGameProps) {
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(window.localStorage.getItem(HIGH_SCORE_KEY));
    return Number.isNaN(stored) ? 0 : stored;
  });
  const [stamina, setStamina] = useState(100);
  const [beltXp, setBeltXp] = useState(0);
  const [enemyMove, setEnemyMove] = useState<Move | null>(null);
  const [choice, setChoice] = useState<Move | null>(null);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(START_TIME_MS);
  const [lastOutcome, setLastOutcome] = useState<RoundOutcome | null>(null);
  const { isOpen: settingsOpen, close: closeSettings } = useSettingsDrawer();
  const [settings, setSettings] = useState<Settings>({
    sounds: true,
    haptics: true,
  });

  const timerRef = useRef<number | null>(null);
  const nextRoundRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const resolveRoundRef = useRef<(player: Move | null) => void>(() => undefined);
  const [celebration, setCelebration] = useState<BeltDescriptor | null>(null);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const belt = useMemo(() => getBeltByXp(beltXp), [beltXp]);

  const triggerCelebration = useCallback((beltInfo: BeltDescriptor) => {
    setConfettiPieces(createConfettiPieces());
    setCelebration(beltInfo);
  }, []);

  const dismissCelebration = useCallback(() => {
    setCelebration(null);
    setConfettiPieces([]);
  }, []);

  const themeStyles = THEMES[theme];

  const updateHighScore = useCallback((candidate: number) => {
    setHighScore((prev) => {
      if (candidate > prev) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(HIGH_SCORE_KEY, String(candidate));
        }
        return candidate;
      }
      return prev;
    });
  }, []);

  const playTone = useCallback(
    (tone: "start" | "win" | "lose") => {
      if (!settings.sounds || typeof window === "undefined") return;
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const frequency = tone === "start" ? 220 : tone === "win" ? 420 : 160;
      osc.type = "triangle";
      osc.frequency.value = frequency;
      gain.gain.value = 0.1;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    },
    [settings.sounds]
  );

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!settings.haptics || typeof navigator === "undefined") return;
      navigator.vibrate?.(pattern);
    },
    [settings.haptics]
  );

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
    if (nextRoundRef.current) {
      clearTimeout(nextRoundRef.current);
      nextRoundRef.current = null;
    }
  }, []);

  const startRound = useCallback(
    (roundNumber: number, scoreSnapshot: number, force = false) => {
      if (!running && !force) return;
      clearTimers();
      const windowMs = difficultyForScore(scoreSnapshot);
      setRound(roundNumber);
      setChoice(null);
      setLastOutcome(null);
      const next = randomMove();
      setEnemyMove(next);
      setTimeLeft(windowMs);
      setMessage("¡Contraatacá!");
      const startedAt = performance.now();

      const tick = () => {
        const elapsed = performance.now() - startedAt;
        const left = Math.max(0, windowMs - elapsed);
        setTimeLeft(left);
        if (left <= 0) {
          resolveRoundRef.current(null);
        } else {
          timerRef.current = requestAnimationFrame(tick);
        }
      };

      timerRef.current = requestAnimationFrame(tick);
    },
    [clearTimers, running]
  );

  const resolveRound = useCallback(
    (player: Move | null) => {
      clearTimers();
      if (!enemyMove) return;

      const outcome = getOutcome(enemyMove, player);
      let newScore = score;
      let newStamina = stamina;
      let newXp = beltXp;
      const previousBelt = getBeltByXp(beltXp);

      if (outcome === "win") {
        newScore += 1;
        newXp += 20;
        newStamina = Math.min(100, newStamina + 5);
        setMessage("¡Bien! Defensa perfecta.");
        playTone("win");
        vibrate(40);
      } else if (outcome === "lose") {
        newScore = Math.max(0, newScore - 1);
        newStamina = Math.max(0, newStamina - 15);
        setMessage("Ups, te atraparon. Ajustá el timing.");
        playTone("lose");
        vibrate([20, 30, 20]);
      } else {
        newStamina = Math.max(0, newStamina - 10);
        setMessage("Muy lento. ¡Reaccioná más rápido!");
        playTone("lose");
        vibrate(60);
      }

      setChoice(player);
      setLastOutcome(outcome);
      setScore(newScore);
      setStamina(newStamina);
      setBeltXp(newXp);
      updateHighScore(newScore);
      const updatedBelt = getBeltByXp(newXp);
      if (updatedBelt.label !== previousBelt.label) {
        triggerCelebration(updatedBelt);
      }

      if (newStamina <= 0) {
        setRunning(false);
        setMessage("Sin gasolina. Reset para volver a rodar.");
        return;
      }

      nextRoundRef.current = setTimeout(() => {
        startRound(round + 1, newScore);
      }, 700);
    },
    [
      beltXp,
      clearTimers,
      enemyMove,
      playTone,
      round,
      score,
      stamina,
      startRound,
      updateHighScore,
      triggerCelebration,
      vibrate,
    ]
  );

  useEffect(() => {
    resolveRoundRef.current = resolveRound;
  }, [resolveRound]);

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => dismissCelebration(), 3600);
    return () => clearTimeout(timer);
  }, [celebration, dismissCelebration]);

  const onPick = useCallback(
    (m: Move) => {
      if (!running) return;
      if (choice) return;
      resolveRound(m);
    },
    [choice, resolveRound, running]
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!running || choice) return;
      const move = KEY_TO_MOVE[event.key];
      if (move) {
        event.preventDefault();
        resolveRound(move);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [choice, resolveRound, running]);

  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      if (nextRoundRef.current) clearTimeout(nextRoundRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setRunning(false);
    setRound(0);
    setScore(0);
    setStamina(100);
    setBeltXp(0);
    setEnemyMove(null);
    setChoice(null);
    setMessage("");
    setTimeLeft(START_TIME_MS);
    setLastOutcome(null);
    dismissCelebration();
  }, [clearTimers, dismissCelebration]);

  const handleSettingToggle = useCallback((key: keyof Settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const xpProgress = Math.min(100, beltXp % 100);

  return (
    <div
      className={`min-h-screen w-full ${themeStyles.backgroundClass} px-4 py-0 sm:px-6 lg:px-0`}
    >
      <div className="mx-auto w-full max-w-4xl space-y-2 sm:space-y-3">
        <div className="rounded-3xl border border-white/5 bg-black/30 p-2 sm:p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-base">
              <span className="opacity-75">Cinturón</span>
              <BeltPill belt={belt.label} color={belt.color} />
            </div>
            <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              XP
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-black/60">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: themeStyles.accent,
                width: `${xpProgress}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-xs sm:text-sm">
            <div className="rounded-2xl border border-white/10 py-1.5 sm:py-2">
              <p className="opacity-60">Score</p>
              <p className="text-lg font-semibold text-white">{score}</p>
            </div>
            <div className="rounded-2xl border border-white/10 py-1.5 sm:py-2">
              <p className="opacity-60">Stamina</p>
              <p className="text-lg font-semibold text-white">{stamina}%</p>
              <div className="mx-auto mt-1 h-1.5 w-3/4 rounded-full bg-black/40">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${stamina}%`,
                    backgroundColor: themeStyles.accent,
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 py-1.5 sm:py-2">
              <p className="opacity-60">High Score</p>
              <p className="text-lg font-semibold text-white">{highScore}</p>
              <p className="text-[10px]" style={{ color: themeStyles.muted }}>
                Persistido
              </p>
            </div>
          </div>
        </div>

        <section
          className="rounded-3xl border p-4 shadow-2xl sm:p-6"
          style={{
            backgroundColor: themeStyles.panelBg,
            borderColor: themeStyles.border,
          }}
        >
          <div className="mb-4 flex items-center justify-between text-sm">
            <div className="font-semibold text-white">Round {round}</div>
            <div style={{ color: themeStyles.muted }}>
              Tiempo: {(timeLeft / 1000).toFixed(2)}s
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <motion.div
              key={enemyMove ?? "none"}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-4 sm:p-6"
              style={{
                backgroundColor: themeStyles.panelBg,
                borderColor: themeStyles.border,
              }}
            >
              <div className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-400">
                Oponente
              </div>
              <div className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
                <span>{enemyMove ? MOVE_EMOJI[enemyMove] : "⏳"}</span>
                <span>{enemyMove ? MOVE_LABEL[enemyMove] : "…"}</span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-2xl border p-4 text-lg sm:p-6 sm:text-xl"
                style={{
                  backgroundColor: themeStyles.panelBg,
                  borderColor: themeStyles.border,
                  color: themeStyles.muted,
                }}
              >
                <div className="text-sm opacity-70 mb-2 text-neutral-100">
                  Coach dice
                </div>
                <div className="text-neutral-50">
                  {message || "Reaccioná con la contra correcta."}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {MOVES.map((m) => {
              const isSelected = choice === m;
              const isWinSelection = isSelected && lastOutcome === "win";
              const borderColor = isWinSelection
                ? "#4ade80"
                : isSelected
                  ? themeStyles.accent
                  : themeStyles.border;
              const backgroundColor = isWinSelection
                ? "rgba(34,197,94,0.9)"
                : isSelected
                  ? themeStyles.accent
                  : "rgba(15,15,15,0.65)";
              const textColor = isWinSelection
                ? "#052e16"
                : isSelected
                  ? themeStyles.accentText
                  : "inherit";

              return (
                <button
                  key={m}
                  onClick={() => onPick(m)}
                  aria-label={`Elegir ${MOVE_LABEL[m]}`}
                  className={`group rounded-2xl border p-3 text-center transition duration-200 min-h-[120px] ${
                    choice === m
                      ? "shadow-lg scale-[0.99]"
                      : "hover:scale-[1.01]"
                  }`}
                  style={{
                    borderColor,
                    backgroundColor,
                    color: textColor,
                  }}
                >
                  <div className="text-2xl">{MOVE_EMOJI[m]}</div>
                  <div className="font-semibold mt-1">{MOVE_LABEL[m]}</div>
                  <div className="text-xs opacity-70 mt-1">
                    Contrarresta {MOVE_LABEL[COUNTERS[m]]}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            {!running ? (
              <button
                aria-label="Iniciar combate"
                onClick={() => {
                  reset();
                  setRunning(true);
                  startRound(1, 0, true);
                  playTone("start");
                  vibrate(20);
                }}
                className="rounded-xl font-semibold py-3 px-5 shadow transition min-h-[44px] min-w-[44px]"
                style={{
                  backgroundColor: themeStyles.accent,
                  color: themeStyles.accentText,
                }}
              >
                Start Roll
              </button>
            ) : (
              <button
                aria-label="Pausar combate"
                onClick={() => {
                  setRunning(false);
                  setMessage("Pausado. Start comienza una nueva ronda.");
                  clearTimers();
                }}
                className="rounded-xl border py-3 px-5 transition min-h-[44px] min-w-[44px]"
                style={{
                  borderColor: themeStyles.border,
                  backgroundColor: themeStyles.panelBg,
                }}
              >
                Pause
              </button>
            )}

            <button
              aria-label="Resetear mini-game"
              onClick={reset}
              className="rounded-xl border py-3 px-5 transition min-h-[44px] min-w-[44px]"
              style={{
                borderColor: themeStyles.border,
                backgroundColor: themeStyles.panelBg,
              }}
            >
              Reset
            </button>
          </div>
        </section>
        <div className="rounded-3xl border border-white/5 bg-black/20 p-3 text-xs sm:text-sm">
          <div className="grid gap-2 sm:grid-cols-3">
            {RULE_RELATIONS.map((rule) => (
              <div
                key={rule.attack}
                className="flex items-center justify-between rounded-full px-3 py-2 font-semibold"
                style={{
                  border: `1px solid ${themeStyles.border}`,
                  backgroundColor: themeStyles.panelBg,
                  color: themeStyles.muted,
                }}
              >
                <span className="text-white">{rule.attack}</span>
                <div className="flex items-center gap-2 text-white">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs"
                    style={{
                      border: `1px solid ${themeStyles.border}`,
                      color: themeStyles.accent,
                    }}
                  >
                    {RULE_ICONS[LABEL_TO_MOVE[rule.attack]]}
                  </span>
                  <span className="text-white" style={{ color: "#4ade80" }}>
                    {rule.losesTo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm leading-relaxed space-y-4 text-neutral-200">
          <div>
            <p className="font-semibold text-base">Cómo jugar</p>
            <ul className="list-disc ml-5 space-y-1 text-neutral-300">
              <li>El oponente tira Pase, Barrido o Sumisión.</li>
              <li>
                Tenés pocos segundos (1, 2 o 3 en teclado) para contestar con la
                contra correcta.
              </li>
              <li>Sumá puntos, subí de cinturón y cuidá tu stamina.</li>
              <li>En móvil funciona perfecto con taps (targets ≥44px).</li>
              <li>Configurá sonidos y haptics en Ajustes.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-base">Reglas de contraataque</p>
            <ul className="list-disc ml-5 space-y-1 text-neutral-300">
              <li>Pase de guardia pierde contra Barrido.</li>
              <li>Barrido pierde contra Sumisión.</li>
              <li>Sumisión pierde contra Pase de guardia.</li>
            </ul>
          </div>
        </div>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={closeSettings}
        settings={settings}
        onToggle={handleSettingToggle}
        theme={themeStyles}
      />
      <CelebrationOverlay
        celebration={celebration}
        confetti={confettiPieces}
        onClose={dismissCelebration}
      />
    </div>
  );
}

function BeltPill({
  belt,
  color,
}: {
  belt: string;
  color: BeltColor;
}) {
  const bg = {
    white: "bg-neutral-100 text-neutral-900",
    blue: "bg-blue-500 text-white",
    purple: "bg-purple-500 text-white",
    brown: "bg-amber-800 text-white",
    black: "bg-neutral-900 text-white border border-neutral-700",
  }[color];
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${bg}`}>
      {belt}
    </span>
  );
}

function SettingsDrawer({
  open,
  onClose,
  settings,
  onToggle,
  theme,
}: {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  onToggle: (key: keyof Settings) => void;
  theme: ThemeConfig;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Cerrar overlay de ajustes"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-xs p-6 space-y-4 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{
              backgroundColor: theme.panelBg,
              borderLeft: `1px solid ${theme.border}`,
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Settings</h2>
              <button
                aria-label="Cerrar ajustes"
                onClick={onClose}
                className="rounded-full border w-10 h-10 flex items-center justify-center min-h-[44px] min-w-[44px]"
                style={{
                  borderColor: theme.border,
                  color: theme.muted,
                  backgroundColor: "transparent",
                }}
              >
                ✕
              </button>
            </div>
            <SettingsToggle
              label="Sounds"
              description="Ping cuando ganás o perdés la ronda."
              value={settings.sounds}
              onClick={() => onToggle("sounds")}
              accent={theme.accent}
              borderColor={theme.border}
            />
            <SettingsToggle
              label="Haptics"
              description="Vibración suave en móviles compatibles."
              value={settings.haptics}
              onClick={() => onToggle("haptics")}
              accent={theme.accent}
              borderColor={theme.border}
            />
            <p className="text-xs" style={{ color: theme.muted }}>
              Ajustes guardados solo en esta sesión.
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function createConfettiPieces(): ConfettiPiece[] {
  return Array.from({ length: 45 }).map((_, idx) => ({
    id: idx,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2600 + Math.random() * 1500,
    size: 6 + Math.random() * 12,
    color: confettiPalette[Math.floor(Math.random() * confettiPalette.length)],
  }));
}

function CelebrationOverlay({
  celebration,
  confetti,
  onClose,
}: {
  celebration: BeltDescriptor | null;
  confetti: ConfettiPiece[];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className="confetti-piece"
                style={{
                  left: `${piece.left}%`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}ms`,
                  backgroundColor: piece.color,
                  width: `${piece.size}px`,
                  height: `${piece.size * 1.4}px`,
                  animationTimingFunction: "linear",
                }}
              />
            ))}
          </div>
          <CelebrationCard celebration={celebration} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CelebrationCard({
  celebration,
  onClose,
}: {
  celebration: BeltDescriptor;
  onClose: () => void;
}) {
  const theme = BELT_THEMES[celebration.color];
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative z-10 max-w-md rounded-3xl border p-8 text-center"
      style={{
        backgroundImage: theme.panelBg,
        borderColor: theme.border,
        color: theme.text,
        boxShadow: theme.glow,
      }}
    >
      <p
        className="text-sm uppercase tracking-[0.4em]"
        style={{ color: theme.accent }}
      >
        ¡Nuevo cinturón!
      </p>
      <h3 className="mt-3 text-3xl font-semibold">{celebration.label}</h3>
      <p className="mt-2" style={{ color: theme.text }}>
        Tu timing va on fire. Seguimos rodando y defendé el título.
      </p>
      <button
        onClick={onClose}
        className="mt-6 rounded-full px-6 py-3 font-semibold transition"
        style={{
          backgroundColor: theme.buttonBg,
          color: theme.buttonText,
        }}
      >
        Seguir rodando
      </button>
    </motion.div>
  );
}

function SettingsToggle({
  label,
  description,
  value,
  onClick,
  accent,
  borderColor,
}: {
  label: string;
  description: string;
  value: boolean;
  onClick: () => void;
  accent: string;
  borderColor: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4 flex items-center justify-between gap-4"
      style={{ borderColor }}
    >
      <div>
        <div className="font-semibold">{label}</div>
        <p className="text-xs opacity-70">{description}</p>
      </div>
      <button
        role="switch"
        aria-label={`Alternar ${label}`}
        aria-checked={value}
        onClick={onClick}
        className="relative inline-flex items-center min-h-[44px] min-w-[70px] justify-between rounded-full px-2 py-1 text-xs font-semibold transition"
        style={{
          backgroundColor: value ? accent : "rgba(255,255,255,0.1)",
          color: value ? "#0f0f0f" : "#e5e5e5",
        }}
      >
        <span>{value ? "ON" : "OFF"}</span>
        <motion.span
          layout
          className="h-6 w-6 rounded-full bg-white shadow"
          style={{
            backgroundColor: value ? "#fff8f6" : "#ffffff",
          }}
        />
      </button>
    </div>
  );
}
