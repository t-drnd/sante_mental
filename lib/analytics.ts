import { db, schema } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export async function calculateWellbeingScore(userId: number, dateRange?: { start: Date; end: Date }) {
  const start = dateRange?.start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = dateRange?.end || new Date();

  const [moodData, meditationData, productivityData, sleepData] = await Promise.all([
    db
      .select()
      .from(schema.journalEntriesTable)
      .where(
        and(
          eq(schema.journalEntriesTable.userId, userId),
          gte(schema.journalEntriesTable.date, start),
          lte(schema.journalEntriesTable.date, end)
        )
      ),
    db
      .select()
      .from(schema.meditationSessionsTable)
      .where(
        and(
          eq(schema.meditationSessionsTable.userId, userId),
          gte(schema.meditationSessionsTable.date, start),
          lte(schema.meditationSessionsTable.date, end)
        )
      ),
    db
      .select()
      .from(schema.productivityEntriesTable)
      .where(
        and(
          eq(schema.productivityEntriesTable.userId, userId),
          gte(schema.productivityEntriesTable.date, start),
          lte(schema.productivityEntriesTable.date, end)
        )
      ),
    db
      .select()
      .from(schema.sleepTrackingTable)
      .where(
        and(
          eq(schema.sleepTrackingTable.userId, userId),
          gte(schema.sleepTrackingTable.date, start),
          lte(schema.sleepTrackingTable.date, end)
        )
      ),
  ]);

  const avgMood = moodData.length > 0
    ? moodData.reduce((sum, e) => sum + e.moodScore, 0) / moodData.length
    : 5;

  const meditationScore = Math.min(meditationData.length * 10, 30);
  const meditationMinutes = meditationData.reduce((sum, m) => sum + m.duration, 0);
  const meditationBonus = Math.min(meditationMinutes / 10, 20);

  const productivityRate = productivityData.length > 0
    ? productivityData.filter((t) => t.completed).length / productivityData.length
    : 0;
  const productivityScore = productivityRate * 30;

  const avgSleep = sleepData.length > 0
    ? sleepData.reduce((sum, s) => sum + (s.sleepHours || 0), 0) / sleepData.length
    : 7;
  const sleepScore = Math.max(0, Math.min(20, (avgSleep / 8) * 20));

  const totalScore = (avgMood / 10) * 30 + meditationScore + meditationBonus + productivityScore + sleepScore;

  return {
    score: Math.round(totalScore),
    breakdown: {
      mood: Math.round((avgMood / 10) * 30),
      meditation: Math.round(meditationScore + meditationBonus),
      productivity: Math.round(productivityScore),
      sleep: Math.round(sleepScore),
    },
    details: {
      avgMood,
      meditationSessions: meditationData.length,
      meditationMinutes,
      productivityRate,
      avgSleep,
    },
  };
}

export async function detectPatterns(userId: number, weeks: number = 4) {
  const start = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
  const end = new Date();

  const entries = await db
    .select()
    .from(schema.journalEntriesTable)
    .where(
      and(
        eq(schema.journalEntriesTable.userId, userId),
        gte(schema.journalEntriesTable.date, start),
        lte(schema.journalEntriesTable.date, end)
      )
    );

  const dayOfWeekMoods: Record<number, number[]> = {};
  const hourMoods: Record<number, number[]> = {};

  entries.forEach((entry) => {
    const date = new Date(entry.date);
    const dayOfWeek = date.getDay();
    const hour = date.getHours();

    if (!dayOfWeekMoods[dayOfWeek]) dayOfWeekMoods[dayOfWeek] = [];
    if (!hourMoods[hour]) hourMoods[hour] = [];

    dayOfWeekMoods[dayOfWeek].push(entry.moodScore);
    hourMoods[hour].push(entry.moodScore);
  });

  const dayAverages: Record<string, number> = {};
  Object.keys(dayOfWeekMoods).forEach((day) => {
    const moods = dayOfWeekMoods[parseInt(day)];
    dayAverages[day] = moods.reduce((sum, m) => sum + m, 0) / moods.length;
  });

  const dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const lowestDay = Object.entries(dayAverages).reduce((min, [day, avg]) =>
    avg < min[1] ? [day, avg] : min
  );

  const patterns: string[] = [];
  if (lowestDay[1] < 5) {
    patterns.push(`Tu sembles avoir une humeur plus basse le ${dayNames[parseInt(lowestDay[0])]}.`);
  }

  return patterns;
}

export async function calculateCorrelations(userId: number, weeks: number = 4) {
  const start = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
  const end = new Date();

  const [moodEntries, sleepEntries, activityEntries] = await Promise.all([
    db
      .select()
      .from(schema.journalEntriesTable)
      .where(
        and(
          eq(schema.journalEntriesTable.userId, userId),
          gte(schema.journalEntriesTable.date, start),
          lte(schema.journalEntriesTable.date, end)
        )
      ),
    db
      .select()
      .from(schema.sleepTrackingTable)
      .where(
        and(
          eq(schema.sleepTrackingTable.userId, userId),
          gte(schema.sleepTrackingTable.date, start),
          lte(schema.sleepTrackingTable.date, end)
        )
      ),
    db
      .select()
      .from(schema.activityTrackingTable)
      .where(
        and(
          eq(schema.activityTrackingTable.userId, userId),
          gte(schema.activityTrackingTable.date, start),
          lte(schema.activityTrackingTable.date, end)
        )
      ),
  ]);

  const correlations: any = {
    sleep: null,
    activity: null,
  };

  if (sleepEntries.length > 0 && moodEntries.length > 0) {
    const sleepMoodPairs: Array<{ sleep: number; mood: number }> = [];
    
    moodEntries.forEach((mood) => {
      const moodDate = new Date(mood.date);
      const sleepEntry = sleepEntries.find((s) => {
        const sleepDate = new Date(s.date);
        return (
          sleepDate.getDate() === moodDate.getDate() &&
          sleepDate.getMonth() === moodDate.getMonth() &&
          sleepDate.getFullYear() === moodDate.getFullYear()
        );
      });

      if (sleepEntry && sleepEntry.sleepHours) {
        sleepMoodPairs.push({
          sleep: sleepEntry.sleepHours,
          mood: mood.moodScore,
        });
      }
    });

    if (sleepMoodPairs.length > 1) {
      const avgSleep = sleepMoodPairs.reduce((sum, p) => sum + p.sleep, 0) / sleepMoodPairs.length;
      const avgMood = sleepMoodPairs.reduce((sum, p) => sum + p.mood, 0) / sleepMoodPairs.length;
      
      const numerator = sleepMoodPairs.reduce(
        (sum, p) => sum + (p.sleep - avgSleep) * (p.mood - avgMood),
        0
      );
      const sleepVariance = sleepMoodPairs.reduce((sum, p) => sum + Math.pow(p.sleep - avgSleep, 2), 0);
      const moodVariance = sleepMoodPairs.reduce((sum, p) => sum + Math.pow(p.mood - avgMood, 2), 0);
      
      const correlation = numerator / Math.sqrt(sleepVariance * moodVariance);
      correlations.sleep = isNaN(correlation) ? null : correlation;
    }
  }

  return correlations;
}

