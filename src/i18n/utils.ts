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
  const [, ...parts] = url.pathname.split('/');
  const currentLangFromUrl = parts[0] in ui ? parts[0] : null;
  const pathWithoutLang = currentLangFromUrl ? parts.slice(1).join('/') : parts.join('/');
  
  if (lang === defaultLang) {
    return `/${pathWithoutLang}`;
  }
  return `/${lang}/${pathWithoutLang}`;
}
