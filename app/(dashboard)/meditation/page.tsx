"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

      <div>
        <h2 className="text-2xl font-semibold text-[#f5f5f5] mb-4">
          Autres pratiques de méditation
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/meditation-guidee">
            <Card className="h-full hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🎧</span>
                  <CardTitle className="text-lg">Méditations guidées</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#a0a0a0] mb-4 text-sm">
                  Méditations pour stress, anxiété, sommeil
                </p>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-sm">Écouter →</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/respiration">
            <Card className="h-full hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🌬️</span>
                  <CardTitle className="text-lg">Respiration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#a0a0a0] mb-4 text-sm">
                  Cohérence cardiaque guidée
                </p>
                <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span className="text-sm">Respirer →</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/sons">
            <Card className="h-full hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🔊</span>
                  <CardTitle className="text-lg">Sons relaxants</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#a0a0a0] mb-4 text-sm">
                  Pluie, océan, forêt, bruit blanc
                </p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm">Écouter →</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
