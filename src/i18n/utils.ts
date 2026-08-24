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

export function getRouteFromUrl(url: URL, lang: keyof typeof ui) {
  const parts = url.pathname.split('/').filter(Boolean);
  const currentLangFromUrl = parts[0] in ui ? parts[0] : null;
  const pathParts = currentLangFromUrl ? parts.slice(1) : parts;
  const cleanPath = pathParts.join('/');
  
  if (lang === defaultLang) {
    return cleanPath ? `/${cleanPath}/` : '/';
  }
  return cleanPath ? `/${lang}/${cleanPath}/` : `/${lang}/`;
}
