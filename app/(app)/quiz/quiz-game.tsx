"use client";

import { Flame, Heart, Play, RotateCcw, Timer, Trophy } from "lucide-react";
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

export type QuizQuestion = {
  id: string;
  topic_id: string;
  topic_name: string;
  subject_id: string;
  question_md: string;
  choices: string[];
  correct_index: number;
  explanation_md: string;
};

type Phase = "intro" | "playing" | "feedback" | "result";

type AnswerRecord = {
  question: QuizQuestion;
  correct: boolean;
  time_used_ms: number;
};

const QUESTION_TIME_MS = 15_000;
const FEEDBACK_MS = 1_400;
const MAX_LIVES = 3;
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

function comboMultiplier(combo: number): number {
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  if (combo >= 3) return 1.5;
  return 1;
}

export function QuizGame({ questions }: { questions: QuizQuestion[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [order, setOrder] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeftMs, setTimeLeftMs] = useState(QUESTION_TIME_MS);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(
    null,
  );
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    if (stored) setBestScore(Number(stored) || 0);
  }, []);

  const startGame = useCallback(() => {
    setOrder(shuffle(questions));
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(MAX_LIVES);
    setTimeLeftMs(QUESTION_TIME_MS);
    setAnswers([]);
    setLastAnswerCorrect(null);
    setSelectedChoice(null);
    setPhase("playing");
    startTimeRef.current = Date.now();
  }, [questions]);

  // Game timer.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = window.setInterval(() => {
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
  }, [phase, currentIndex]);

  const currentQuestion: QuizQuestion | undefined = order[currentIndex];

  const endWithAnswer = useCallback(
    (correct: boolean, pickedIndex: number | null) => {
      if (!currentQuestion) return;
      const timeUsed = Math.max(
        0,
        QUESTION_TIME_MS - timeLeftMs,
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
        newScore = score + Math.round(base * mult) + timeBonus;
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
        { question: currentQuestion, correct, time_used_ms: timeUsed },
      ]);
      setPhase("feedback");

      window.setTimeout(() => {
        if (newLives <= 0 || currentIndex + 1 >= order.length) {
          setPhase("result");
          if (newScore > bestScore) {
            setBestScore(newScore);
            try {
              window.localStorage.setItem(BEST_SCORE_KEY, String(newScore));
            } catch {}
          }
        } else {
          setCurrentIndex((i) => i + 1);
          setTimeLeftMs(QUESTION_TIME_MS);
          setSelectedChoice(null);
          setLastAnswerCorrect(null);
          setPhase("playing");
        }
      }, FEEDBACK_MS);
    },
    [bestScore, combo, currentIndex, currentQuestion, lives, maxCombo, order.length, score, timeLeftMs],
  );

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
        questionCount={questions.length}
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

  const progressPct = (timeLeftMs / QUESTION_TIME_MS) * 100;
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
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
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
            timeLow ? "bg-red-500" : "bg-primary",
          )}
          style={{ width: `${progressPct}%` }}
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
            return (
              <button
                key={i}
                type="button"
                disabled={phase === "feedback"}
                onClick={() =>
                  endWithAnswer(i === currentQuestion.correct_index, i)
                }
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md border bg-card px-3 py-2.5 text-left text-sm transition-all",
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
    </div>
  );
}

function QuizIntro({
  bestScore,
  questionCount,
  onStart,
}: {
  bestScore: number;
  questionCount: number;
  onStart: () => void;
}) {
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
          <CardTitle>Règles</CardTitle>
          <CardDescription>Tu as 15 secondes par question.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <ul className="list-disc pl-5 [&>li]:mb-1">
            <li>
              <strong>+10 points</strong> par bonne réponse, × multiplicateur
              combo (×1,5 à 3 consécutives, ×2 à 5, ×3 à 10).
            </li>
            <li>
              <strong>Bonus temps</strong> : 0,5 pt par seconde restante.
            </li>
            <li>
              <strong>Mauvaise réponse ou temps écoulé</strong> : -1 vie, combo
              remis à zéro.
            </li>
            <li>
              <strong>Fin de partie</strong> : 0 vie OU toutes les questions
              jouées.
            </li>
          </ul>
          <div className="mt-4 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-xs">
            <span className="text-muted-foreground">
              {questionCount} questions dans le pool
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Trophy className="size-3.5 text-amber-500" aria-hidden="true" />
              Meilleur score : <strong>{bestScore}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onStart} size="lg" className="self-start">
        <Play className="size-4" />
        Lancer le quiz
      </Button>
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

      <Button onClick={onRestart} size="lg" className="self-start">
        <RotateCcw className="size-4" />
        Rejouer
      </Button>
    </div>
  );
}
