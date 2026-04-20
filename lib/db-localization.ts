import type {
  Chapter,
  ChapterProgress,
  DashboardOverview,
  Scenario,
  SessionStartResponse,
  Topic,
  TopicProgress,
  WordOfTheWeek,
  WordScenario,
  WordTopic,
} from '@/lib/types';

export type Language = 'ar' | 'en';

type ApiLocalizedValue =
  | string
  | null
  | undefined
  | {
      raw?: string | null;
      ar?: string | null;
      en?: string | null;
      variation?: string | null;
    };

function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const dir = window.localStorage.getItem('dir');
  // If dir is explicitly 'rtl', use 'ar'. Otherwise (including 'ltr' or null), use 'en'.
  const lang = dir === 'rtl' ? 'ar' : 'en';
  console.log(`[Localization] Detected language: ${lang} (dir: ${dir})`);
  return lang as Language;
}

function pick(language: Language, ar?: string | null, en?: string | null, fallback?: string | null) {
  return language === 'en' ? en || fallback || null : ar || fallback || null;
}

function pickLocalized(language: Language, value?: ApiLocalizedValue, fallback?: string | null) {
  if (typeof value === 'string' && value.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object') {
        const result = language === 'en'
          ? parsed.en || parsed.variation || parsed.raw || parsed.ar || fallback || null
          : parsed.ar || parsed.variation || parsed.raw || parsed.en || fallback || null;
        console.log(`[Localization] Parsed JSON for ${language}:`, result);
        return result;
      }
    } catch (e) {
      console.error('[Localization] JSON parse error:', e);
    }
  }

  if (typeof value === 'string') return value || fallback || null;
  if (!value) return fallback || null;

  // STRICT ENGLISH: If we are in English mode, prioritize English fields. 
  // If English is null/missing, DO NOT fall back to raw/ar if a fallback string already exists.
  if (language === 'en') {
    const enVal = value.en || value.variation;
    if (enVal) return enVal;
    
    // If we have a fallback string (like the already-localized name), use it instead of Arabic enrichment
    if (fallback) return fallback;

    return value.raw || value.ar || null;
  }

  // Arabic mode: prioritize Arabic fields
  return value.ar || value.variation || value.raw || value.en || fallback || null;
}

/**
 * Centrally parses error messages from the backend.
 * If the message is a localized object (or JSON string of one), it picks the right language.
 */
export function localizeErrorMessage(message: any, lang?: Language): string {
  const language = lang || getLanguage();
  console.log(`[Localization] localizeErrorMessage input (lang: ${language}):`, message);
  
  // If no message at all, return a generic but descriptive fallback
  if (!message) {
    console.warn('[Localization] No message provided to localizeErrorMessage');
    return 'An unexpected error occurred';
  }

  let parsed = message;

  // 1. Try parsing if it's a JSON string
  if (typeof message === 'string' && message.trim().startsWith('{')) {
    try {
      parsed = JSON.parse(message);
      console.log('[Localization] Parsed string into object:', parsed);
    } catch (e) {
      console.error('[Localization] Failed to parse JSON string error message:', e);
      return message;
    }
  }

  // 2. Resolve localization if we have an object
  if (parsed && typeof parsed === 'object') {
    // Check for direct localized fields FIRST (my new pattern)
    // This is important because NestJS might inject a 'message' or 'error' sibling
    if (parsed.en || parsed.ar) {
      const result = (language === 'en' ? parsed.en || parsed.ar : parsed.ar || parsed.en);
      console.log('[Localization] Found direct localized fields, result:', result);
      return result;
    }

    // Check for nested message property (standard NestJS/Axios pattern)
    if (parsed.message) {
      // If it's an array (validation errors), pick the first one or join them
      if (Array.isArray(parsed.message)) {
        console.log('[Localization] message is an array (validation errors)');
        return parsed.message.join(', ');
      }
      console.log('[Localization] Recursing into parsed.message');
      return localizeErrorMessage(parsed.message, language);
    }

    // If it has an 'error' property (Express fallback), use that
    if (parsed.error && typeof parsed.error === 'string') {
      console.log('[Localization] Using parsed.error fallback:', parsed.error);
      return parsed.error;
    }

    // If it's a generic object but not our expected format, stringify for visibility
    const stringified = JSON.stringify(parsed);
    console.log('[Localization] No known patterns found, stringified:', stringified);
    return stringified;
  }

  // 3. Plain string fallback
  console.log('[Localization] Plain string fallback:', message);
  return String(message);
}


function isJsonString(val: any): boolean {
  return typeof val === 'string' && val.trim().startsWith('{');
}

function localizeName<T extends { name: any; nameAr?: string | null; nameEn?: string | null; nameText?: ApiLocalizedValue }>(entity: T, lang?: Language): T {
  const language = lang || getLanguage();
  const nameFallback = typeof entity.name === 'string' ? entity.name : null;
  
  // 1. JSON in the main 'name' field is the absolute highest priority
  if (isJsonString(entity.name)) {
    const jsonVal = pickLocalized(language, entity.name, null);
    if (jsonVal) return { ...entity, name: jsonVal };
  }

  // 2. Historical localized columns (nameAr/nameEn)
  const historical = pick(language, entity.nameAr, entity.nameEn);
  if (historical) return { ...entity, name: historical };

  // 3. Enrichment object (nameText) - only use if it has the requested language or variation
  const enriched = pickLocalized(language, entity.nameText, null);
  if (enriched) {
    // Basic verification: if we are in English mode and it gave us back the same Arabic fallback string, keep looking
    const isProbablyArFallback = language === 'en' && enriched === nameFallback;
    if (!isProbablyArFallback) return { ...entity, name: enriched };
  }

  return {
    ...entity,
    name: nameFallback || entity.name,
  };
}

export function localizeChapter<T extends Chapter>(chapter: T, lang?: Language): T {
  return localizeName(chapter, lang);
}

export function localizeTopic<T extends Topic>(topic: T, lang?: Language): T {
  const language = lang || getLanguage();
  const subtitleFallback = typeof topic.subtitle === 'string' ? topic.subtitle : null;
  
  const localized = localizeName(topic, language);

  // subtitle localization with same prioritization
  let localizedSubtitle: string | null = null;
  
  if (isJsonString(topic.subtitle)) {
    localizedSubtitle = pickLocalized(language, topic.subtitle as string, null);
  }

  if (!localizedSubtitle) {
    localizedSubtitle = pick(language, topic.subtitleAr, topic.subtitleEn);
  }

  if (!localizedSubtitle) {
    const enriched = pickLocalized(language, (topic as any).subtitleText, null);
    const isProbablyArFallback = language === 'en' && enriched === subtitleFallback;
    if (!isProbablyArFallback) localizedSubtitle = enriched;
  }

  return {
    ...localized,
    subtitle: localizedSubtitle || subtitleFallback || topic.subtitle,
  };
}

export function localizeScenario<T extends Scenario>(scenario: T, lang?: Language): T {
  const language = lang || getLanguage();
  const pinyinFallback = typeof scenario.targetPhrasePinyin === 'string' ? scenario.targetPhrasePinyin : null;

  let localizedPinyin: string | null = null;

  if (isJsonString(scenario.targetPhrasePinyin)) {
    localizedPinyin = pickLocalized(language, scenario.targetPhrasePinyin as string, null);
  }

  if (!localizedPinyin) {
    localizedPinyin = pick(language, scenario.targetPhrasePinyinAr, scenario.targetPhrasePinyinEn);
  }

  if (!localizedPinyin) {
    const enriched = pickLocalized(language, (scenario as any).targetPhrasePinyinText ?? (scenario as any).phrase?.variation, null);
    const isProbablyArFallback = language === 'en' && enriched === pinyinFallback;
    if (!isProbablyArFallback) localizedPinyin = enriched;
  }

  return {
    ...scenario,
    targetPhrasePinyin: localizedPinyin || pinyinFallback || scenario.targetPhrasePinyin,
  };
}

export function localizeWord<T extends WordOfTheWeek>(word: T, lang?: Language): T {
  const language = lang || getLanguage();
  const englishFallback = typeof (word as any).english === 'string' ? (word as any).english : null;
  const exampleFallback = typeof (word as any).exampleSentence === 'string' ? (word as any).exampleSentence : null;

  let localizedEnglish: string | null = null;
  let localizedExample: string | null = null;

  // English field
  if (isJsonString((word as any).english)) {
    localizedEnglish = pickLocalized(language, (word as any).english, null);
  }
  if (!localizedEnglish) {
    localizedEnglish = pick(language, (word as any).englishAr, (word as any).englishEn);
  }
  if (!localizedEnglish) {
    const enriched = pickLocalized(language, (word as any).englishText ?? (word as any).translations?.english, null);
    const isProbablyArFallback = language === 'en' && enriched === englishFallback;
    if (!isProbablyArFallback) localizedEnglish = enriched;
  }

  // Example Sentence field
  if (isJsonString((word as any).exampleSentence)) {
    localizedExample = pickLocalized(language, (word as any).exampleSentence, null);
  }
  if (!localizedExample) {
    localizedExample = pick(language, (word as any).exampleSentenceAr, (word as any).exampleSentenceEn);
  }
  if (!localizedExample) {
    const enriched = pickLocalized(language, (word as any).exampleSentenceText ?? (word as any).translations?.exampleSentence, null);
    const isProbablyArFallback = language === 'en' && enriched === exampleFallback;
    if (!isProbablyArFallback) localizedExample = enriched;
  }

  return {
    ...word,
    english: localizedEnglish || englishFallback || (word as any).english,
    exampleSentence: localizedExample || exampleFallback || (word as any).exampleSentence,
  };
}

export function localizeWordTopic<T extends WordTopic>(topic: T, lang?: Language): T {
  const language = lang || getLanguage();
  const subtitleFallback = typeof topic.subtitle === 'string' ? topic.subtitle : null;
  
  const localized = localizeName(topic as any, language);

  let localizedSubtitle: string | null = null;
  if (isJsonString(topic.subtitle)) {
    localizedSubtitle = pickLocalized(language, topic.subtitle as string, null);
  }
  if (!localizedSubtitle) {
    localizedSubtitle = pick(language, topic.subtitleAr, topic.subtitleEn);
  }
  if (!localizedSubtitle) {
    const enriched = pickLocalized(language, (topic as any).subtitleText, null);
    const isProbablyArFallback = language === 'en' && enriched === subtitleFallback;
    if (!isProbablyArFallback) localizedSubtitle = enriched;
  }

  return {
    ...localized,
    subtitle: localizedSubtitle || subtitleFallback || topic.subtitle,
    scenarios: topic.scenarios?.map(s => localizeWordScenario(s, language)),
    word: topic.word ? localizeWord(topic.word, language) : topic.word,
  } as T;
}

export function localizeWordScenario<T extends WordScenario>(scenario: T, lang?: Language): T {
  return localizeScenario(scenario as any, lang) as any;
}

export function localizeTopicProgress<T extends TopicProgress>(topic: T, lang?: Language): T {
  const language = lang || getLanguage();
  const nameFallback = typeof topic.name === 'string' ? topic.name : null;
  const subtitleFallback = typeof topic.subtitle === 'string' ? topic.subtitle : null;
  const chapterFallback = typeof topic.chapterName === 'string' ? topic.chapterName : null;

  let locName: string | null = null;
  let locSubtitle: string | null = null;
  let locChapter: string | null = null;

  // Name
  if (isJsonString(topic.name)) locName = pickLocalized(language, topic.name as string, null);
  if (!locName) locName = pick(language, topic.nameAr, topic.nameEn);
  if (!locName) {
    const enriched = pickLocalized(language, (topic as any).nameText, null);
    if (!(language === 'en' && enriched === nameFallback)) locName = enriched;
  }

  // Subtitle
  if (isJsonString(topic.subtitle)) locSubtitle = pickLocalized(language, topic.subtitle as string, null);
  if (!locSubtitle) locSubtitle = pick(language, topic.subtitleAr, topic.subtitleEn);
  if (!locSubtitle) {
    const enriched = pickLocalized(language, (topic as any).subtitleText, null);
    if (!(language === 'en' && enriched === subtitleFallback)) locSubtitle = enriched;
  }

  // Chapter Name
  if (isJsonString(topic.chapterName)) locChapter = pickLocalized(language, topic.chapterName as string, null);
  if (!locChapter) locChapter = pick(language, topic.chapterNameAr, topic.chapterNameEn);
  if (!locChapter) {
    const enriched = pickLocalized(language, (topic as any).chapterNameText, null);
    if (!(language === 'en' && enriched === chapterFallback)) locChapter = enriched;
  }

  return {
    ...topic,
    name: locName || nameFallback || topic.name,
    subtitle: locSubtitle || subtitleFallback || topic.subtitle,
    chapterName: locChapter || chapterFallback || topic.chapterName,
  };
}

export function localizeChapterProgress<T extends ChapterProgress>(chapter: T, lang?: Language): T {
  const language = lang || getLanguage();
  const nameFallback = typeof chapter.name === 'string' ? chapter.name : null;

  let locName: string | null = null;
  if (isJsonString(chapter.name)) locName = pickLocalized(language, chapter.name as string, null);
  if (!locName) locName = pick(language, chapter.nameAr, chapter.nameEn);
  if (!locName) {
    const enriched = pickLocalized(language, (chapter as any).nameText, null);
    if (!(language === 'en' && enriched === nameFallback)) locName = enriched;
  }

  return {
    ...chapter,
    name: locName || nameFallback || chapter.name,
    topics: chapter.topics.map(t => localizeTopicProgress(t, language)),
  };
}

export function localizeDashboardOverview<T extends DashboardOverview>(overview: T, lang?: Language): T {
  return {
    ...overview,
    wordOfTheWeek: overview.wordOfTheWeek ? localizeWord(overview.wordOfTheWeek, lang) : overview.wordOfTheWeek,
  };
}

export function localizeSessionResponse<T extends SessionStartResponse>(response: T, lang?: Language): T {
  const language = lang || getLanguage();
  return {
    ...response,
    topic: {
      ...localizeTopic(response.topic as any, language),
      chapter: response.topic.chapter ? localizeChapter(response.topic.chapter as any, language) : response.topic.chapter,
    },
    scenarios: response.scenarios.map(s => localizeScenario(s, language)),
  };
}
