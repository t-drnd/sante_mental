import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekOffset = parseInt(searchParams.get("weekOffset") || "0");

    const targetDate = new Date();
    const weekStart = startOfWeek(subWeeks(targetDate, weekOffset), {
      weekStartsOn: 1,
    });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    // Vérifier si un rapport existe déjà
    const existingReport = await db.weeklyReport.findUnique({
      where: {
        userId_weekStart: {
          userId: session.user.id,
          weekStart,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(existingReport);
    }

    // Générer le rapport - récupérer toutes les données en parallèle
    const [journalEntries, meditationSessions, productivityEntries] =
      await Promise.all([
        db.journalEntry.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        }),
        db.meditationSession.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        }),
        db.productivityEntry.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: weekStart,
              lte: weekEnd,
            },
          },
        }),
      ]);

    const averageMoodScore =
      journalEntries.length > 0
        ? journalEntries.reduce((sum, e) => sum + e.moodScore, 0) /
          journalEntries.length
        : null;

    const totalMeditationMinutes = meditationSessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );

    const totalProductivityTasks = productivityEntries.length;
    const completedTasks = productivityEntries.filter(
      (e) => e.completed
    ).length;

    // Générer des insights
    let insights = "";
    let recommendations = "";

    if (averageMoodScore !== null) {
      if (averageMoodScore < 5) {
        insights += "Votre humeur moyenne cette semaine est plutôt basse. ";
        recommendations +=
          "Essayez d'augmenter vos sessions de méditation et de prendre du temps pour vous. ";
      } else if (averageMoodScore >= 7) {
        insights += "Votre humeur moyenne cette semaine est excellente ! ";
      }
    }

    if (totalMeditationMinutes < 30) {
      recommendations +=
        "Considérez augmenter votre pratique de méditation à au moins 30 minutes par semaine. ";
    }

    if (
      completedTasks / totalProductivityTasks < 0.7 &&
      totalProductivityTasks > 0
    ) {
      recommendations +=
        "Vous pourriez bénéficier de mieux prioriser vos tâches pour améliorer votre taux de complétion. ";
    }

    const report = await db.weeklyReport.create({
      data: {
        userId: session.user.id,
        weekStart,
        weekEnd,
        averageMoodScore,
        totalMeditationMinutes: totalMeditationMinutes || null,
        totalProductivityTasks: totalProductivityTasks || null,
        completedTasks: completedTasks || null,
        insights: insights || null,
        recommendations: recommendations || null,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Erreur génération rapport:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    );
  }
}
