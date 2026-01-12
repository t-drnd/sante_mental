import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  timestamp,
  boolean,
  text,
  real,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const journalEntryTypeEnum = pgEnum("journal_entry_type", ["guided", "free", "quick"]);
export const breathingPatternEnum = pgEnum("breathing_pattern", ["4-7-8", "5-5-5", "4-4-4"]);
export const goalStatusEnum = pgEnum("goal_status", ["active", "completed", "paused"]);
export const habitStatusEnum = pgEnum("habit_status", ["active", "completed", "skipped"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: roleEnum("role").notNull().default("user"),
  password: varchar({ length: 255 }).notNull(),
});

export const journalEntriesTable = pgTable("journal_entries", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  moodScore: integer().notNull(),
  emotion: varchar({ length: 255 }),
  notes: text(),
  entryType: journalEntryTypeEnum("entry_type").default("free"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const productivityEntriesTable = pgTable("productivity_entries", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  task: varchar({ length: 255 }).notNull(),
  description: text(),
  timeSpent: integer(),
  completed: boolean().notNull().default(false),
  priority: priorityEnum("priority"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const meditationSessionsTable = pgTable("meditation_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  duration: integer().notNull(),
  type: varchar({ length: 255 }).notNull(),
  notes: text(),
  completed: boolean().notNull().default(true),
  isGuided: boolean().notNull().default(false),
  audioUrl: varchar({ length: 500 }),
  createdAt: timestamp().notNull().defaultNow(),
});

export const weeklyReportsTable = pgTable("weekly_reports", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  weekStart: timestamp().notNull(),
  weekEnd: timestamp().notNull(),
  averageMoodScore: real(),
  totalMeditationMinutes: integer(),
  totalProductivityTasks: integer(),
  completedTasks: integer(),
  insights: text(),
  recommendations: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const guidedJournalEntriesTable = pgTable("guided_journal_entries", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  questionType: varchar({ length: 100 }).notNull(),
  question: text().notNull(),
  answer: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const quickCheckinsTable = pgTable("quick_checkins", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  moodScore: integer().notNull(),
  emotion: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
});

export const guidedMeditationsTable = pgTable("guided_meditations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 100 }).notNull(),
  audioUrl: varchar({ length: 500 }),
  duration: integer().notNull(),
  completed: boolean().notNull().default(false),
  completedAt: timestamp(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const breathingSessionsTable = pgTable("breathing_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  pattern: breathingPatternEnum("pattern").notNull(),
  cycles: integer().notNull(),
  duration: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const soundSessionsTable = pgTable("sound_sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  soundType: varchar({ length: 100 }).notNull(),
  duration: integer().notNull(),
  volume: integer().default(50),
  createdAt: timestamp().notNull().defaultNow(),
});

export const wellbeingGoalsTable = pgTable("wellbeing_goals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  category: varchar({ length: 100 }),
  status: goalStatusEnum("status").notNull().default("active"),
  targetDate: timestamp(),
  progress: integer().default(0),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const microHabitsTable = pgTable("micro_habits", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  streak: integer().default(0),
  longestStreak: integer().default(0),
  status: habitStatusEnum("status").notNull().default("active"),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const habitCompletionsTable = pgTable("habit_completions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  habitId: integer()
    .notNull()
    .references(() => microHabitsTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  completed: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
});

export const affirmationsTable = pgTable("affirmations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  text: text().notNull(),
  category: varchar({ length: 100 }),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const aiConversationsTable = pgTable("ai_conversations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar({ length: 50 }).notNull(),
  messages: text().notNull(),
  context: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const sleepTrackingTable = pgTable("sleep_tracking", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  sleepHours: real(),
  sleepQuality: integer(),
  bedtime: timestamp(),
  wakeTime: timestamp(),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const activityTrackingTable = pgTable("activity_tracking", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  date: timestamp().notNull().defaultNow(),
  activityType: varchar({ length: 100 }),
  duration: integer(),
  intensity: varchar({ length: 50 }),
  notes: text(),
  createdAt: timestamp().notNull().defaultNow(),
});
