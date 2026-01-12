"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const meditationTypes = [
  { value: "guidée", label: "Méditation guidée" },
  { value: "silencieuse", label: "Méditation silencieuse" },
  { value: "respiration", label: "Respiration" },
  { value: "pleine-conscience", label: "Pleine conscience" },
  { value: "visualisation", label: "Visualisation" },
];

interface MeditationTimerProps {
  onSessionSaved?: () => void;
}

export function MeditationTimer({ onSessionSaved }: MeditationTimerProps) {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(5 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [type, setType] = useState("guidée");
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }
    setIsRunning(true);
    setIsPaused(false);
    setCompleted(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
    setCompleted(false);
  };

  const saveSession = async () => {
    const actualDuration = Math.ceil((duration * 60 - timeLeft) / 60);
    if (actualDuration === 0) return;

    try {
      const res = await fetch("/api/meditation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration: actualDuration,
          type,
          notes: notes || undefined,
          completed: true,
        }),
      });

      if (res.ok) {
        resetTimer();
        setNotes("");
        if (onSessionSaved) {
          onSessionSaved();
        }
        alert("Session enregistrée avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timer de méditation</CardTitle>
        <CardDescription>Réglez votre session de méditation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning && !completed && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#f5f5f5]">
                Durée (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="60"
                value={duration}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setDuration(val);
                  setTimeLeft(val * 60);
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#f5f5f5]">
                Type de méditation
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all"
              >
                {meditationTypes.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    className="bg-[#111111] text-[#f5f5f5]"
                  >
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {formatTime(timeLeft)}
          </div>
          {completed && (
            <p className="text-green-400 font-medium mb-4">
              Session terminée ! 🎉
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {!isRunning && !completed && (
            <Button onClick={startTimer} className="w-full">
              Commencer
            </Button>
          )}
          {isRunning && isPaused && (
            <Button onClick={resumeTimer} className="w-full">
              Reprendre
            </Button>
          )}
          {isRunning && !isPaused && (
            <Button onClick={pauseTimer} variant="outline" className="w-full">
              Pause
            </Button>
          )}
          {isRunning && (
            <Button onClick={resetTimer} variant="outline">
              Réinitialiser
            </Button>
          )}
        </div>

        {completed && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#f5f5f5]">
                Notes (optionnel)
              </label>
              <Textarea
                placeholder="Comment s'est passée votre session ?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <Button onClick={saveSession} className="w-full">
              Enregistrer la session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
