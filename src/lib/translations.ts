import path from "node:path";
import fs from "node:fs/promises";

/**
 * Get a translation string for a given locale and key from the messages files.
 * @param locale The locale code, e.g. 'en', 'fr', 'th', etc.
 * @param key The translation key, e.g. 'welcome', 'thailand', etc.
 * @returns The translation string, or undefined if not found.
 */
export async function getTranslations(lang: string): Promise<Map<string, string> | undefined> {
  try {
    const filePath = path.join(process.cwd(), "messages", `${lang}.json`);
    const file = await fs.readFile(filePath, "utf-8");
    const translations = JSON.parse(file);
    return new Map(Object.entries(translations));
  } catch (error) {
    console.error(`Error loading translation for locale '${lang}':`, error);
    return undefined;
  }
}
