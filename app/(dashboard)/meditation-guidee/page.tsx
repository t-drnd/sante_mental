"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guidedMeditations = [
  {
    id: 1,
    title: "Méditation pour réduire le stress",
    category: "stress",
    duration: 10,
    description:
      "Une méditation guidée pour apaiser l'esprit et réduire le stress",
  },
  {
    id: 2,
    title: "Méditation contre l'anxiété",
    category: "anxiety",
    duration: 15,
    description:
      "Techniques de respiration et visualisation pour gérer l'anxiété",
  },
  {
    id: 3,
    title: "Méditation pour le sommeil",
    category: "sleep",
    duration: 20,
    description: "Détente profonde pour favoriser un sommeil réparateur",
  },
  {
    id: 4,
    title: "Méditation de pleine conscience",
    category: "mindfulness",
    duration: 12,
    description:
      "Pratique de la pleine conscience pour être présent ici et maintenant",
  },
];

export default function MeditationGuideePage() {
  const [selectedMeditation, setSelectedMeditation] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = (id: number) => {
    setSelectedMeditation(id);
    setIsPlaying(true);
  };

  const handleComplete = async () => {
    if (selectedMeditation) {
      const meditation = guidedMeditations.find(
        (m) => m.id === selectedMeditation
      );
      if (meditation) {
        try {
          await fetch("/api/meditation/guided", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: meditation.title,
              category: meditation.category,
              duration: meditation.duration,
            }),
          });
        } catch (err) {
          console.error("Erreur:", err);
        }
      }
      setIsPlaying(false);
      setSelectedMeditation(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Méditations guidées
        </h1>
        <p className="text-[#a0a0a0] mt-2">
          Choisis une méditation adaptée à tes besoins
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guidedMeditations.map((meditation) => (
          <Card
            key={meditation.id}
            className="hover:border-purple-500/50 transition-all"
          >
            <CardHeader>
              <CardTitle>{meditation.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#a0a0a0] mb-4">
                {meditation.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#a0a0a0]">
                  Durée: {meditation.duration} min
                </span>
                {selectedMeditation === meditation.id && isPlaying ? (
                  <div className="space-y-2">
                    <div className="text-sm text-purple-400">En cours...</div>
                    <Button onClick={handleComplete} size="sm">
                      Terminer
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => handleStart(meditation.id)}>
                    Commencer
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMeditation && isPlaying && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-[#a0a0a0] mb-4">
              🎧 Écoute la méditation guidée
            </p>
            <p className="text-sm text-[#666]">
              Note: Les fichiers audio doivent être ajoutés dans{" "}
              <code className="bg-[#1a1a1a] px-2 py-1 rounded">
                public/meditations/
              </code>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
