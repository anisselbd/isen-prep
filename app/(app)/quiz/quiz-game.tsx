"use client";

import {
  BookOpen,
  ChevronDown,
  Flame,
  Heart,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Snowflake,
  Split,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { recordQuizAttempt } from "./actions";

export type QuizQuestion = {
  id: string;
  topic_id: string;
  topic_name: string;
  subject_id: string;
  difficulty: number;
  question_md: string;
  choices: string[];
  correct_index: number;
  explanation_md: string;
};

export type QuizSubject = { id: string; name: string };

type Phase = "intro" | "playing" | "feedback" | "result";

type SubjectFilter = "all" | string; // "all" or subject id
type DifficultyFilter = "all" | "easy" | "medium" | "hard";

type GameMode = "classic" | "sprint" | "survival" | "perfection" | "flash";

type ModeConfig = {
  key: GameMode;
  name: string;
  description: string;
  questionTimeMs: number;
  maxLives: number;
  /** null = play until pool exhausted (or lives gone). */
  questionCount: number | null;
  scoreMultiplier: number;
};

const MODE_CONFIG: Record<GameMode, ModeConfig> = {
  classic: {
    key: "classic",
    name: "Classique",
    description: "15 s/question · 3 vies · toutes les questions",
    questionTimeMs: 15_000,
    maxLives: 3,
    questionCount: null,
    scoreMultiplier: 1,
  },
  sprint: {
    key: "sprint",
    name: "Sprint",
    description: "20 questions · 3 vies · 15 s/question",
    questionTimeMs: 15_000,
    maxLives: 3,
    questionCount: 20,
    scoreMultiplier: 1,
  },
  survival: {
    key: "survival",
    name: "Survival",
    description: "Infini tant que tu as une vie",
    questionTimeMs: 15_000,
    maxLives: 3,
    questionCount: null,
    scoreMultiplier: 1,
  },
  perfection: {
    key: "perfection",
    name: "Perfection",
    description: "1 seule erreur autorisée",
    questionTimeMs: 15_000,
    maxLives: 1,
    questionCount: null,
    scoreMultiplier: 1.5,
  },
  flash: {
    key: "flash",
    name: "Flash",
    description: "5 s/question · score ×2",
    questionTimeMs: 5_000,
    maxLives: 3,
    questionCount: null,
    scoreMultiplier: 2,
  },
};

type AnswerRecord = {
  question: QuizQuestion;
  correct: boolean;
  time_used_ms: number;
  picked_index: number | null;
};

type PowerUpsState = {
  fifty_fifty: number;
  freeze: number;
  skip: number;
};

const INITIAL_POWER_UPS: PowerUpsState = {
  fifty_fifty: 2,
  freeze: 2,
  skip: 2,
};

const FREEZE_DURATION_MS = 5_000;

const BEST_SCORE_KEY = "isen-prep:quiz-best";

// Shuffle a copy of the array (Fisher-Yates).
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i]!;
    out[i] = out[j]!;
    out[j] = tmp;
  }
  return out;
}

/**
 * Shuffle weighted (higher weight → more likely to be picked earlier).
 * Items with weight 0 are still included at the end.
 */
function weightedShuffle<T>(items: T[], weightOf: (item: T) => number): T[] {
  const pool = items.slice();
  const out: T[] = [];
  while (pool.length > 0) {
    const weights = pool.map((it) => Math.max(0.0001, weightOf(it)));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length - 1; idx++) {
      r -= weights[idx]!;
      if (r <= 0) break;
    }
    out.push(pool[idx]!);
    pool.splice(idx, 1);
  }
  return out;
}

function comboMultiplier(combo: number): number {
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  if (combo >= 3) return 1.5;
  return 1;
}

function matchesDifficulty(q: QuizQuestion, f: DifficultyFilter): boolean {
  if (f === "all") return true;
  if (f === "easy") return q.difficulty <= 2;
  if (f === "medium") return q.difficulty === 3;
  if (f === "hard") return q.difficulty >= 4;
  return true;
}

type QuizGameProps = {
  questions: QuizQuestion[];
  subjects: QuizSubject[];
  masteryByTopic: Record<string, number>;
};

export function QuizGame({ questions, subjects, masteryByTopic }: QuizGameProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [mode, setMode] = useState<GameMode>("classic");
  const [order, setOrder] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const modeCfg = MODE_CONFIG[mode];
  const [lives, setLives] = useState(modeCfg.maxLives);
  const [timeLeftMs, setTimeLeftMs] = useState(modeCfg.questionTimeMs);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(
    null,
  );
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [weightedByWeakness, setWeightedByWeakness] = useState(false);
  const [powerUps, setPowerUps] = useState<PowerUpsState>(INITIAL_POWER_UPS);
  const [hiddenChoices, setHiddenChoices] = useState<Set<number>>(new Set());
  const [freezeUntil, setFreezeUntil] = useState<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) setBestScore(Number(stored) || 0);
  }, []);

  const filteredQuestions = useMemo(
    () =>
      questions.filter(
        (q) =>
          (subjectFilter === "all" || q.subject_id === subjectFilter) &&
          matchesDifficulty(q, difficultyFilter),
      ),
    [questions, subjectFilter, difficultyFilter],
  );

  const startGame = useCallback(() => {
    const pool = filteredQuestions;
    if (pool.length === 0) return;
    let ordered = weightedByWeakness
      ? weightedShuffle(pool, (q) => {
          const m = masteryByTopic[q.topic_id] ?? 0;
          return 1 - m + 0.2;
        })
      : shuffle(pool);
    if (modeCfg.questionCount !== null) {
      ordered = ordered.slice(0, modeCfg.questionCount);
    }
    if (mode === "survival") {
      // Survival loops through the pool many times; the game ends only on
      // 0 lives. Repeat the shuffled order enough times to cover a very long
      // streak (300 questions ≈ always enough in practice).
      const loops = Math.max(1, Math.ceil(300 / ordered.length));
      const repeated: QuizQuestion[] = [];
      for (let i = 0; i < loops; i++) repeated.push(...shuffle(ordered));
      ordered = repeated;
    }
    setOrder(ordered);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(modeCfg.maxLives);
    setTimeLeftMs(modeCfg.questionTimeMs);
    setAnswers([]);
    setLastAnswerCorrect(null);
    setSelectedChoice(null);
    setPowerUps(INITIAL_POWER_UPS);
    setHiddenChoices(new Set());
    setFreezeUntil(0);
    setPhase("playing");
    startTimeRef.current = Date.now();
  }, [filteredQuestions, masteryByTopic, mode, modeCfg.maxLives, modeCfg.questionCount, modeCfg.questionTimeMs, weightedByWeakness]);

  // Game timer — pauses while a freeze is active. We also bump a tick state
  // every 100 ms so the UI re-renders even while frozen (to flip the "freeze
  // active" badge back off when the freeze ends).
  const [, setTick] = useState(0);
  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      if (Date.now() < freezeUntil) return; // frozen — skip decrement
      setTimeLeftMs((prev) => {
        const next = prev - 100;
        if (next <= 0) {
          window.clearInterval(id);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [phase, currentIndex, freezeUntil]);

  const currentQuestion: QuizQuestion | undefined = order[currentIndex];

  const useFiftyFifty = useCallback(() => {
    if (powerUps.fifty_fifty <= 0 || !currentQuestion || phase !== "playing") return;
    if (hiddenChoices.size > 0) return; // already used this question
    // Pick 2 wrong indices at random to hide.
    const wrongIndices: number[] = [];
    for (let i = 0; i < currentQuestion.choices.length; i++) {
      if (i !== currentQuestion.correct_index) wrongIndices.push(i);
    }
    const shuffled = shuffle(wrongIndices);
    const toHide = new Set(shuffled.slice(0, 2));
    setHiddenChoices(toHide);
    setPowerUps((p) => ({ ...p, fifty_fifty: p.fifty_fifty - 1 }));
  }, [powerUps.fifty_fifty, currentQuestion, phase, hiddenChoices]);

  const useFreeze = useCallback(() => {
    if (powerUps.freeze <= 0 || phase !== "playing") return;
    setFreezeUntil(Date.now() + FREEZE_DURATION_MS);
    setPowerUps((p) => ({ ...p, freeze: p.freeze - 1 }));
  }, [powerUps.freeze, phase]);

  const useSkip = useCallback(() => {
    if (powerUps.skip <= 0 || phase !== "playing" || !currentQuestion) return;
    setPowerUps((p) => ({ ...p, skip: p.skip - 1 }));
    // Record as a "skipped" answer — not counted as wrong, no life lost.
    setAnswers((a) => [
      ...a,
      {
        question: currentQuestion,
        correct: false,
        time_used_ms: modeCfg.questionTimeMs - timeLeftMs,
        picked_index: null,
      },
    ]);
    // Advance directly — no feedback phase.
    if (currentIndex + 1 >= order.length) {
      setPhase("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeftMs(modeCfg.questionTimeMs);
      setSelectedChoice(null);
      setLastAnswerCorrect(null);
      setHiddenChoices(new Set());
      setFreezeUntil(0);
    }
  }, [powerUps.skip, phase, currentQuestion, currentIndex, order.length, modeCfg.questionTimeMs, timeLeftMs]);

  const endWithAnswer = useCallback(
    (correct: boolean, pickedIndex: number | null) => {
      if (!currentQuestion) return;
      const timeUsed = Math.max(
        0,
        modeCfg.questionTimeMs - timeLeftMs,
      );

      let newLives = lives;
      let newScore = score;
      let newCombo = combo;
      let newMaxCombo = maxCombo;

      if (correct) {
        newCombo = combo + 1;
        if (newCombo > newMaxCombo) newMaxCombo = newCombo;
        const mult = comboMultiplier(newCombo);
        const base = 10;
        const timeBonus = Math.round((timeLeftMs / 1000) * 0.5);
        const rawPoints = base * mult + timeBonus;
        newScore = score + Math.round(rawPoints * modeCfg.scoreMultiplier);
      } else {
        newLives = lives - 1;
        newCombo = 0;
      }

      setLives(newLives);
      setScore(newScore);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setSelectedChoice(pickedIndex);
      setLastAnswerCorrect(correct);
      setAnswers((a) => [
        ...a,
        {
          question: currentQuestion,
          correct,
          time_used_ms: timeUsed,
          picked_index: pickedIndex,
        },
      ]);
      setPhase("feedback");

      // Fire-and-forget: record in DB so attempts feed into mastery.
      recordQuizAttempt({
        exercise_id: currentQuestion.id,
        picked_index: pickedIndex ?? -1,
        is_correct: correct,
        time_seconds: Math.round(timeUsed / 1000),
      }).catch(() => {
        // Silent — game shouldn't stop if the network flickers.
      });

      // Persist best score eagerly so the result screen shows it correctly
      // whichever exit path the player takes.
      if (newScore > bestScore) {
        setBestScore(newScore);
        try {
          window.localStorage.setItem(BEST_SCORE_KEY, String(newScore));
        } catch {}
      }
    },
    [bestScore, combo, currentQuestion, lives, maxCombo, score, timeLeftMs],
  );

  const advanceToNext = useCallback(() => {
    if (lives <= 0 || currentIndex + 1 >= order.length) {
      setPhase("result");
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeftMs(modeCfg.questionTimeMs);
      setSelectedChoice(null);
      setLastAnswerCorrect(null);
      setHiddenChoices(new Set());
      setFreezeUntil(0);
      setPhase("playing");
    }
  }, [currentIndex, lives, modeCfg.questionTimeMs, order.length]);

  // Time runs out during a question.
  useEffect(() => {
    if (phase === "playing" && timeLeftMs === 0) {
      endWithAnswer(false, null);
    }
  }, [phase, timeLeftMs, endWithAnswer]);

  if (phase === "intro") {
    return (
      <QuizIntro
        bestScore={bestScore}
        questionCount={filteredQuestions.length}
        subjects={subjects}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        weightedByWeakness={weightedByWeakness}
        setWeightedByWeakness={setWeightedByWeakness}
        hasMastery={Object.keys(masteryByTopic).length > 0}
        mode={mode}
        setMode={setMode}
        onStart={startGame}
      />
    );
  }

  if (phase === "result") {
    return (
      <QuizResult
        score={score}
        bestScore={bestScore}
        maxCombo={maxCombo}
        answers={answers}
        totalQuestions={order.length}
        lives={lives}
        onRestart={startGame}
      />
    );
  }

  if (!currentQuestion) return null;

  const progressPct = (timeLeftMs / modeCfg.questionTimeMs) * 100;
  const timeLow = timeLeftMs <= 5000;
  const mult = comboMultiplier(combo);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Question {currentIndex + 1} / {order.length}
        </span>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-mono tabular-nums">
            <Trophy className="size-4 text-amber-500" aria-hidden="true" />
            {score}
          </span>
          {combo > 0 ? (
            <span
              className={cn(
                "flex items-center gap-1 font-mono tabular-nums",
                combo >= 5
                  ? "text-orange-500"
                  : combo >= 3
                    ? "text-amber-600"
                    : "text-muted-foreground",
              )}
            >
              <Flame className="size-4" aria-hidden="true" />
              {combo} ×{mult}
            </span>
          ) : null}
          <span className="flex items-center gap-0.5">
            {Array.from({ length: modeCfg.maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "size-4",
                  i < lives
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground/30",
                )}
                aria-hidden="true"
              />
            ))}
          </span>
        </div>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full transition-[width,background-color] duration-100 ease-linear",
            Date.now() < freezeUntil
              ? "bg-sky-400"
              : timeLow
                ? "bg-red-500"
                : "bg-primary",
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PowerUpButton
          icon={Split}
          label="50:50"
          count={powerUps.fifty_fifty}
          disabled={
            phase !== "playing" ||
            powerUps.fifty_fifty === 0 ||
            hiddenChoices.size > 0
          }
          onClick={useFiftyFifty}
        />
        <PowerUpButton
          icon={Snowflake}
          label={Date.now() < freezeUntil ? "Gel actif" : "Geler"}
          count={powerUps.freeze}
          disabled={
            phase !== "playing" ||
            powerUps.freeze === 0 ||
            Date.now() < freezeUntil
          }
          onClick={useFreeze}
          highlighted={Date.now() < freezeUntil}
        />
        <PowerUpButton
          icon={SkipForward}
          label="Passer"
          count={powerUps.skip}
          disabled={phase !== "playing" || powerUps.skip === 0}
          onClick={useSkip}
        />
      </div>

      <Card
        className={cn(
          "transition-colors",
          phase === "feedback" && lastAnswerCorrect === true
            ? "border-emerald-500 bg-emerald-500/10"
            : phase === "feedback" && lastAnswerCorrect === false
              ? "border-red-500 bg-red-500/5"
              : "",
        )}
      >
        <CardHeader>
          <CardDescription className="flex items-center gap-1">
            <Timer className="size-3.5" />
            <span className="tabular-nums">
              {(timeLeftMs / 1000).toFixed(1)}s
            </span>
            <span className="mx-2">·</span>
            <span>{currentQuestion.topic_name}</span>
          </CardDescription>
          <CardTitle className="text-lg leading-7 [&>p]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {currentQuestion.question_md}
            </ReactMarkdown>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {currentQuestion.choices.map((choice, i) => {
            const isCorrect = i === currentQuestion.correct_index;
            const isSelected = i === selectedChoice;
            const showAsCorrect = phase === "feedback" && isCorrect;
            const showAsWrong =
              phase === "feedback" && isSelected && !isCorrect;
            const isHidden = hiddenChoices.has(i);
            return (
              <button
                key={i}
                type="button"
                disabled={phase === "feedback" || isHidden}
                onClick={() =>
                  endWithAnswer(i === currentQuestion.correct_index, i)
                }
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md border bg-card px-3 py-2.5 text-left text-sm transition-all",
                  isHidden && "pointer-events-none opacity-30 line-through",
                  showAsCorrect
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                    : showAsWrong
                      ? "border-red-500 bg-red-500/10"
                      : "hover:border-primary/40 hover:bg-accent/40",
                  phase === "feedback" ? "cursor-default" : "cursor-pointer",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-md border font-mono text-xs",
                    showAsCorrect
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : showAsWrong
                        ? "border-red-500 bg-red-500 text-white"
                        : "bg-muted",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 [&>p]:mb-0">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {choice}
                  </ReactMarkdown>
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {phase === "feedback" ? (
        <div
          className={cn(
            "rounded-md border px-4 py-3 text-sm",
            lastAnswerCorrect
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-red-500/40 bg-red-500/5",
          )}
        >
          <div className="mb-1 font-semibold">
            {lastAnswerCorrect ? "Bonne réponse !" : "Raté."}
          </div>
          {currentQuestion.explanation_md ? (
            <div className="text-muted-foreground [&>p]:mb-0">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQuestion.explanation_md}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === "feedback" ? (
        <Button onClick={advanceToNext} size="lg" className="self-end" autoFocus>
          {lives <= 0 || currentIndex + 1 >= order.length
            ? "Voir les résultats"
            : "Question suivante"}
          <span className="ml-2 rounded border border-current/30 px-1.5 py-0.5 font-mono text-[10px] opacity-70">
            Entrée
          </span>
        </Button>
      ) : null}
    </div>
  );
}

type QuizIntroProps = {
  bestScore: number;
  questionCount: number;
  subjects: QuizSubject[];
  subjectFilter: SubjectFilter;
  setSubjectFilter: (s: SubjectFilter) => void;
  difficultyFilter: DifficultyFilter;
  setDifficultyFilter: (d: DifficultyFilter) => void;
  weightedByWeakness: boolean;
  setWeightedByWeakness: (b: boolean) => void;
  hasMastery: boolean;
  mode: GameMode;
  setMode: (m: GameMode) => void;
  onStart: () => void;
};

function PowerUpButton({
  icon: Icon,
  label,
  count,
  disabled,
  onClick,
  highlighted,
}: {
  icon: typeof Snowflake;
  label: string;
  count: number;
  disabled: boolean;
  onClick: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors",
        highlighted
          ? "border-sky-400 bg-sky-500/10 text-sky-700 dark:text-sky-300"
          : disabled
            ? "cursor-not-allowed border-muted bg-muted/20 text-muted-foreground/50"
            : "border-border bg-card hover:border-primary/40 hover:bg-accent/40",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          "rounded-full px-1.5 py-0 font-mono text-[10px]",
          disabled
            ? "bg-muted/50 text-muted-foreground/50"
            : "bg-muted text-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function QuizIntro({
  bestScore,
  questionCount,
  subjects,
  subjectFilter,
  setSubjectFilter,
  difficultyFilter,
  setDifficultyFilter,
  weightedByWeakness,
  setWeightedByWeakness,
  hasMastery,
  mode,
  setMode,
  onStart,
}: QuizIntroProps) {
  const canStart = questionCount > 0;
  const modeCfg = MODE_CONFIG[mode];
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Quiz arcade</h1>
        <p className="text-sm text-muted-foreground">
          Une rafale de QCM chronométrés. Score + combo + 3 vies. Bonne chance.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>
            Filtre le pool, choisis un mode, lance. Tes réponses comptent pour
            ton mastery (comme en pratique adaptative).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Mode de jeu
            </div>
            <div className="flex flex-wrap gap-2">
              {(["classic", "sprint", "survival", "perfection", "flash"] as GameMode[]).map(
                (m) => (
                  <FilterChip
                    key={m}
                    active={mode === m}
                    onClick={() => setMode(m)}
                  >
                    {MODE_CONFIG[m].name}
                  </FilterChip>
                ),
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {modeCfg.description}
            </p>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Matière
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={subjectFilter === "all"}
                onClick={() => setSubjectFilter("all")}
              >
                Toutes
              </FilterChip>
              {subjects.map((s) => (
                <FilterChip
                  key={s.id}
                  active={subjectFilter === s.id}
                  onClick={() => setSubjectFilter(s.id)}
                >
                  {s.name}
                </FilterChip>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Difficulté
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={difficultyFilter === "all"}
                onClick={() => setDifficultyFilter("all")}
              >
                Toutes
              </FilterChip>
              <FilterChip
                active={difficultyFilter === "easy"}
                onClick={() => setDifficultyFilter("easy")}
              >
                Facile (1-2)
              </FilterChip>
              <FilterChip
                active={difficultyFilter === "medium"}
                onClick={() => setDifficultyFilter("medium")}
              >
                Moyen (3)
              </FilterChip>
              <FilterChip
                active={difficultyFilter === "hard"}
                onClick={() => setDifficultyFilter("hard")}
              >
                Difficile (4-5)
              </FilterChip>
            </div>
          </div>

          {hasMastery ? (
            <label className="flex cursor-pointer items-start gap-3 rounded-md border bg-muted/20 px-3 py-2.5">
              <input
                type="checkbox"
                checked={weightedByWeakness}
                onChange={(e) => setWeightedByWeakness(e.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <div className="flex-1">
                <div className="font-medium">Prioriser mes points faibles</div>
                <div className="text-xs text-muted-foreground">
                  Tire plus souvent les questions des topics où ton mastery est bas.
                </div>
              </div>
            </label>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Règles</CardTitle>
          <CardDescription>15 secondes par question.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <ul className="list-disc pl-5 [&>li]:mb-1">
            <li>
              <strong>+10 pts</strong> × multiplicateur combo (×1,5 à 3, ×2 à 5,
              ×3 à 10 consécutives).
            </li>
            <li>
              <strong>Bonus temps</strong> : 0,5 pt par seconde restante.
            </li>
            <li>
              <strong>Erreur ou timeout</strong> : -1 vie, combo remis à zéro.
            </li>
            <li>
              <strong>Fin</strong> : 0 vie OU toutes les questions jouées.
            </li>
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs">
            <span className="text-muted-foreground">
              {questionCount} question{questionCount > 1 ? "s" : ""} dans ce pool
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Trophy className="size-3.5 text-amber-500" aria-hidden="true" />
              Record : <strong>{bestScore}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onStart}
        size="lg"
        className="self-start"
        disabled={!canStart}
      >
        <Play className="size-4" />
        {canStart
          ? "Lancer le quiz"
          : "Aucune question dans ce filtre"}
      </Button>
    </div>
  );
}

function WrongAnswerReview({ record }: { record: AnswerRecord }) {
  const [open, setOpen] = useState(false);
  const q = record.question;
  const picked = record.picked_index ?? -1;
  const lessonHref = `/subjects/${q.subject_id}/${q.topic_id}/lesson`;

  return (
    <div className="rounded-md border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent/40"
        aria-expanded={open}
      >
        <X className="mt-0.5 size-4 shrink-0 text-red-500" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{q.topic_name}</div>
          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground [&>p]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {q.question_md}
            </ReactMarkdown>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="flex flex-col gap-3 border-t px-3 py-3 text-sm">
          <div className="[&>p]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {q.question_md}
            </ReactMarkdown>
          </div>
          <ul className="flex flex-col gap-1">
            {q.choices.map((c, i) => {
              const isCorrect = i === q.correct_index;
              const isPicked = i === picked;
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-2 py-1.5",
                    isCorrect && "border-emerald-500 bg-emerald-500/10",
                    !isCorrect && isPicked && "border-red-500 bg-red-500/10",
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 [&>p]:mb-0">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {c}
                    </ReactMarkdown>
                  </span>
                  {isCorrect ? (
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      bonne
                    </span>
                  ) : isPicked ? (
                    <span className="text-xs font-medium text-red-700 dark:text-red-400">
                      ton choix
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {q.explanation_md ? (
            <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground [&>p]:mb-0">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {q.explanation_md}
              </ReactMarkdown>
            </div>
          ) : null}
          <Link
            href={lessonHref}
            className="inline-flex w-fit items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <BookOpen className="size-3.5" />
            Voir la leçon de {q.topic_name}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function QuizResult({
  score,
  bestScore,
  maxCombo,
  answers,
  totalQuestions,
  lives,
  onRestart,
}: {
  score: number;
  bestScore: number;
  maxCombo: number;
  answers: AnswerRecord[];
  totalQuestions: number;
  lives: number;
  onRestart: () => void;
}) {
  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy =
    answers.length === 0
      ? 0
      : Math.round((correctCount / answers.length) * 100);
  const avgTime =
    answers.length === 0
      ? 0
      : answers.reduce((sum, a) => sum + a.time_used_ms, 0) / answers.length;

  // Per-topic wrong breakdown.
  const wrongByTopic = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of answers) {
      if (!a.correct) {
        map.set(a.question.topic_name, (map.get(a.question.topic_name) ?? 0) + 1);
      }
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [answers]);

  const wrongAnswers = useMemo(
    () => answers.filter((a) => !a.correct),
    [answers],
  );

  const isNewBest = score > 0 && score === bestScore;
  const gameOver = lives <= 0 && answers.length < totalQuestions;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {gameOver ? "Game over" : "Partie terminée"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isNewBest
            ? "🏆 Nouveau record !"
            : `Record : ${bestScore}`}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-5xl font-bold tabular-nums">
            {score}
          </CardTitle>
          <CardDescription className="text-center">points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold tabular-nums">
                {correctCount}/{answers.length}
              </div>
              <div className="text-xs text-muted-foreground">bonnes</div>
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums">
                {maxCombo}
              </div>
              <div className="text-xs text-muted-foreground">combo max</div>
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums">
                {(avgTime / 1000).toFixed(1)}s
              </div>
              <div className="text-xs text-muted-foreground">temps moyen</div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Précision : <span className="font-mono">{accuracy}%</span>
          </div>

          {wrongByTopic.length > 0 ? (
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Points à retravailler
              </h3>
              <ul className="flex flex-col gap-1 text-sm">
                {wrongByTopic.map(([topic, n]) => (
                  <li key={topic} className="flex justify-between">
                    <span>{topic}</span>
                    <span className="font-mono text-muted-foreground">
                      {n} erreur{n > 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {wrongAnswers.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Revoir mes erreurs ({wrongAnswers.length})
            </CardTitle>
            <CardDescription>
              Clique pour déplier. La bonne réponse est en vert, ton choix en rouge.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {wrongAnswers.map((a, i) => (
              <WrongAnswerReview key={`${a.question.id}-${i}`} record={a} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Button onClick={onRestart} size="lg" className="self-start">
        <RotateCcw className="size-4" />
        Rejouer
      </Button>
    </div>
  );
}
