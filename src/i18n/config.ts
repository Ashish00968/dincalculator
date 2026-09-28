export interface LocaleConfig {
  name: string;
  indexable: boolean;
}

export const LOCALE_CONFIG: Record<string, LocaleConfig> = {
  en: { name: 'English', indexable: true },
  de: { name: 'Deutsch', indexable: true },
  fr: { name: 'Français', indexable: true },
  it: { name: 'Italiano', indexable: true },
  es: { name: 'Español', indexable: false },
  ja: { name: '日本語', indexable: false },
  sv: { name: 'Svenska', indexable: false },
  no: { name: 'Norsk', indexable: false },
  nl: { name: 'Nederlands', indexable: false },
  pl: { name: 'Polski', indexable: false },
  cs: { name: 'Čeština', indexable: false },
  fi: { name: 'Suomi', indexable: false },
};

export const INDEXABLE_LOCALES = Object.keys(LOCALE_CONFIG).filter(
  (lang) => LOCALE_CONFIG[lang].indexable
);

export function isIndexablePath(urlOrPath: string): boolean {
  let pathname = urlOrPath;
  try {
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      pathname = new URL(urlOrPath).pathname;
    }
  } catch {}

  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return true; // root '/' is indexable
  if (clean === '404.html' || clean === '500.html' || clean === '404' || clean === '500') return false;

  const parts = clean.split('/');
  const first = parts[0];

  if (first in LOCALE_CONFIG) {
    return LOCALE_CONFIG[first].indexable;
  }

  return true; // English pages
}
