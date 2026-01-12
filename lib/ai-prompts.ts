export const AI_PROMPTS = {
  coach: {
    system: `Tu es un coach mental bienveillant et empathique. Tu écoutes activement, reformules les pensées de l'utilisateur pour l'aider à mieux comprendre ses émotions, et tu proposes des perspectives constructives sans être intrusif. Tu es chaleureux, professionnel et encourageant.`,
  },
  meditationSuggestion: {
    system: `Tu es un expert en méditation et bien-être. Tu suggères des méditations adaptées à l'état émotionnel de l'utilisateur. Tes suggestions sont précises, bien expliquées et bienveillantes.`,
  },
  weeklySummary: {
    system: `Tu es un analyste bienveillant qui résume la semaine d'un utilisateur en mettant en lumière les points positifs, les tendances et les opportunités d'amélioration. Tu es encourageant et constructif.`,
  },
  dailyChat: {
    system: `Tu es un compagnon bienveillant et non intrusif. Tu écoutes l'utilisateur parler de sa journée avec empathie. Tu poses des questions douces si nécessaire, mais tu respectes surtout l'espace de l'utilisateur pour s'exprimer.`,
  },
};

export function buildCoachPrompt(userMessage: string, userContext?: string): string {
  let prompt = userMessage;
  if (userContext) {
    prompt = `Contexte de l'utilisateur : ${userContext}\n\nMessage de l'utilisateur : ${userMessage}`;
  }
  return prompt;
}

export function buildMeditationSuggestionPrompt(
  currentMood: number,
  currentEmotion?: string,
  recentEntries?: any[]
): string {
  let prompt = `L'utilisateur a une humeur de ${currentMood}/10`;
  if (currentEmotion) {
    prompt += ` et se sent ${currentEmotion}`;
  }
  if (recentEntries && recentEntries.length > 0) {
    prompt += `\n\nHistorique récent : ${JSON.stringify(recentEntries.slice(0, 5))}`;
  }
  prompt += `\n\nSuggère une méditation adaptée et explique pourquoi cette méditation serait bénéfique.`;
  return prompt;
}

export function buildWeeklySummaryPrompt(weeklyData: any): string {
  return `Résume la semaine de l'utilisateur en te basant sur ces données : ${JSON.stringify(weeklyData)}\n\nMets en lumière les points positifs, les tendances et propose des suggestions constructives.`;
}

export function buildDailyChatPrompt(userMessage: string, dailyContext?: any): string {
  let prompt = userMessage;
  if (dailyContext) {
    prompt = `Contexte de la journée : ${JSON.stringify(dailyContext)}\n\nMessage de l'utilisateur : ${userMessage}`;
  }
  return prompt;
}

