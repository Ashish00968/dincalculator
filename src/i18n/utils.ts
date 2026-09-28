import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

const MULTI_LANG_PATHS = new Set([
  '',
  'din-chart',
  'bsl-guide',
  'skier-types',
  'about',
  'contact',
  'privacy',
  'terms'
]);

export function hasLocalizedRoutes(url: URL): boolean {
  const parts = url.pathname.split('/').filter(Boolean);
  const currentLang = parts[0] in ui ? parts[0] : null;
  const pathParts = currentLang ? parts.slice(1) : parts;
  const cleanPath = pathParts.join('/');
  return MULTI_LANG_PATHS.has(cleanPath);
}

export function getRouteFromUrl(url: URL, lang: keyof typeof ui) {
  const parts = url.pathname.split('/').filter(Boolean);
  const currentLangFromUrl = parts[0] in ui ? parts[0] : null;
  const pathParts = currentLangFromUrl ? parts.slice(1) : parts;
  const cleanPath = pathParts.join('/');

  if (!MULTI_LANG_PATHS.has(cleanPath)) {
    if (lang === defaultLang) {
      return cleanPath ? `/${cleanPath}/` : '/';
    }
    return `/${lang}/`;
  }
  
  if (lang === defaultLang) {
    return cleanPath ? `/${cleanPath}/` : '/';
  }
  return cleanPath ? `/${lang}/${cleanPath}/` : `/${lang}/`;
}
