import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { getSession } from "@/lib/get-session";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { eq, and, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weekOffset = parseInt(searchParams.get("weekOffset") || "0");
    const userId = parseInt(session.user.id);

    const targetDate = new Date();
    const weekStart = startOfWeek(subWeeks(targetDate, weekOffset), {
      weekStartsOn: 1,
    });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    const existingReport = await db
      .select()
      .from(schema.weeklyReportsTable)
      .where(
        and(
          eq(schema.weeklyReportsTable.userId, userId),
          eq(schema.weeklyReportsTable.weekStart, weekStart)
        )
      )
      .limit(1);

    if (existingReport.length > 0) {
      return NextResponse.json(existingReport[0]);
    }

    const [journalEntries, meditationSessions, productivityEntries] =
      await Promise.all([
        db
          .select()
          .from(schema.journalEntriesTable)
          .where(
            and(
              eq(schema.journalEntriesTable.userId, userId),
              gte(schema.journalEntriesTable.date, weekStart),
              lte(schema.journalEntriesTable.date, weekEnd)
            )
          ),
        db
          .select()
          .from(schema.meditationSessionsTable)
          .where(
            and(
              eq(schema.meditationSessionsTable.userId, userId),
              gte(schema.meditationSessionsTable.date, weekStart),
              lte(schema.meditationSessionsTable.date, weekEnd)
            )
          ),
        db
          .select()
          .from(schema.productivityEntriesTable)
          .where(
            and(
              eq(schema.productivityEntriesTable.userId, userId),
              gte(schema.productivityEntriesTable.date, weekStart),
              lte(schema.productivityEntriesTable.date, weekEnd)
            )
          ),
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

    const [report] = await db
      .insert(schema.weeklyReportsTable)
      .values({
        userId,
        weekStart,
        weekEnd,
        averageMoodScore,
        totalMeditationMinutes: totalMeditationMinutes || null,
        totalProductivityTasks: totalProductivityTasks || null,
        completedTasks: completedTasks || null,
        insights: insights || null,
        recommendations: recommendations || null,
      })
      .returning();

    return NextResponse.json(report);
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    );
  }
}
