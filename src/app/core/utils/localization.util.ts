import { LocalizedText, UiStringDictionary } from '@core/interfaces/localized-text.interface';

export function resolveLocalizedText(
  entry: LocalizedText,
  language: string,
  fallbackLanguage = 'en'
): string {
  return entry[language as keyof LocalizedText] ?? entry[fallbackLanguage as keyof LocalizedText] ?? '';
}

export function resolveUiString(
  dictionary: UiStringDictionary,
  key: string,
  language: string,
  ...args: any[]
): string {
  const entry = dictionary[key];
  if (!entry) {
    return key;
  }

  const localized = typeof entry === 'function' ? entry(...args) : entry;
  return resolveLocalizedText(localized, language);
}
