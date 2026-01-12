"use client";

import { useState, useEffect } from "react";
import { MeditationTimer } from "@/components/meditation/meditation-timer";
import { SessionList } from "@/components/meditation/session-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MeditationPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const handleSessionSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const fetchSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const res = await fetch("/api/ai/meditation-suggestions", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data.suggestion);
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Méditation
        </h1>
        <p className="text-[#a0a0a0] mt-2">
          Pratiquez la méditation et suivez vos sessions
        </p>
      </div>

      {aiSuggestion && (
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-purple-400">💡 Suggestion IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#e0e0e0] whitespace-pre-wrap">{aiSuggestion}</p>
            <Button
              onClick={fetchSuggestion}
              disabled={loadingSuggestion}
              variant="outline"
              className="mt-4"
              size="sm"
            >
              {loadingSuggestion ? "Chargement..." : "Nouvelle suggestion"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <MeditationTimer onSessionSaved={handleSessionSaved} />
        <SessionList key={refreshKey} />
      </div>
    </div>
  );
}
