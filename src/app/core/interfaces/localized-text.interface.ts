export interface LocalizedText { es: string; en: string;}

export type UiStringEntry = LocalizedText | ((...args: any[]) => LocalizedText);

export type UiStringDictionary = Record<string, UiStringEntry>;
