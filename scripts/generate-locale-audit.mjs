import fs from 'fs';
import path from 'path';

const DIST_DIR = 'dist';
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'ja', 'sv', 'no', 'nl', 'pl', 'cs', 'fi'];

// Common English marker words indicating untranslated English content
const EN_WORDS = new Set([
  'the', 'and', 'of', 'to', 'is', 'for', 'with', 'on', 'your', 'by', 'are', 'from', 'at', 'as', 'this', 'be', 'an', 'have', 'not', 'or', 'skier', 'binding', 'bindings', 'weight', 'height', 'length', 'setting', 'release', 'calculate', 'standard', 'guide', 'table', 'profile', 'chart', 'about', 'contact', 'privacy', 'terms'
]);

// Locale-specific stopword dictionaries
const STOPWORDS = {
  de: new Set([
    'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen', 'und', 'in', 'von', 'zu', 'mit', 'sich', 'auf', 'für', 'ist', 'im', 'nicht', 'als', 'auch', 'es', 'an', 'werden', 'aus', 'er', 'hat', 'dass', 'sie', 'nach', 'wird', 'bei', 'um', 'am', 'sind', 'noch', 'wie', 'über', 'so', 'war', 'haben', 'nur', 'oder', 'aber', 'vor', 'zur', 'bis', 'mehr', 'durch', 'man', 'sein', 'wurde', 'sei', 'skifahrer', 'bindung', 'skibindung', 'sohlenlänge', 'körpergewicht', 'körpergröße', 'auslösewert', 'z-wert', 'tabelle', 'norm', 'hinweis', 'sicherheit', 'über', 'kontakt', 'datenschutz', 'bedingungen'
  ]),
  fr: new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'et', 'en', 'à', 'dans', 'pour', 'par', 'sur', 'avec', 'est', 'sont', 'qui', 'que', 'ne', 'pas', 'plus', 'ce', 'cette', 'ces', 'son', 'sa', 'ses', 'leur', 'leurs', 'nous', 'vous', 'ils', 'elles', 'ou', 'où', 'mais', 'donc', 'or', 'ni', 'car', 'skieur', 'fixation', 'fixations', 'semelle', 'longueur', 'poids', 'taille', 'âge', 'réglage', 'déclenchement', 'norme', 'tableau', 'sécurité', 'propos', 'contact', 'conditions', 'confidentialité'
  ]),
  it: new Set([
    'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una', 'di', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'a', 'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'da', 'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle', 'in', 'nel', 'nello', 'nella', 'nei', 'negli', 'nelle', 'su', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle', 'con', 'per', 'tra', 'fra', 'e', 'ed', 'o', 'od', 'se', 'ma', 'che', 'chi', 'cui', 'quale', 'quali', 'come', 'dove', 'quando', 'perché', 'è', 'sono', 'ha', 'hanno', 'era', 'erano', 'sarà', 'saranno', 'stato', 'stata', 'stati', 'state', 'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'quelli', 'quelle', 'mio', 'tuo', 'suo', 'nostro', 'vostro', 'loro', 'più', 'meno', 'molto', 'poco', 'tutto', 'tutti', 'tutte', 'anche', 'non', 'già', 'ancora', 'solo', 'prima', 'dopo', 'sopra', 'sotto', 'sciatore', 'sciatori', 'attacco', 'attacchi', 'suola', 'lunghezza', 'peso', 'altezza', 'età', 'taratura', 'valore', 'valori', 'regolazione', 'sicurezza', 'norma', 'tabella', 'scarponi', 'scarpone', 'contatto', 'termini', 'privacy'
  ]),
  es: new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'a', 'al', 'en', 'para', 'por', 'con', 'sin', 'sobre', 'y', 'e', 'o', 'u', 'que', 'es', 'son', 'se', 'su', 'sus', 'como', 'más', 'pero', 'esquiador', 'fijación', 'fijaciones', 'suela', 'peso', 'altura', 'longitud', 'tabla', 'ajuste'
  ]),
  nl: new Set([
    'de', 'het', 'een', 'en', 'van', 'in', 'op', 'te', 'voor', 'met', 'is', 'er', 'niet', 'om', 'aan', 'als', 'maar', 'bij', 'over', 'skiër', 'binding', 'gewicht', 'lengte', 'zoollengte', 'tabel'
  ]),
  sv: new Set([
    'och', 'det', 'att', 'i', 'en', 'jag', 'hon', 'som', 'han', 'på', 'den', 'med', 'var', 'sig', 'för', 'så', 'till', 'är', 'men', 'ett', 'om', 'hade', 'de', 'av', 'skidåkare', 'bindning', 'vikt', 'längd', 'tabell'
  ]),
  no: new Set([
    'og', 'i', 'det', 'på', 'som', 'er', 'en', 'til', 'å', 'han', 'av', 'for', 'ikke', 'med', 'at', 'var', 'meg', 'seg', 'men', 'et', 'har', 'om', 'skiløper', 'binding', 'vekt', 'høyde', 'sålelengde', 'tabell'
  ]),
  fi: new Set([
    'ja', 'on', 'ei', 'se', 'että', 'kuin', 'mutta', 'niin', 'hän', 'tai', 'hän', 'jos', 'kun', 'ovat', 'myös', 'hiihtäjä', 'side', 'siteet', 'paino', 'pituus', 'taulukko'
  ]),
  pl: new Set([
    'i', 'w', 'na', 'z', 'do', 'że', 'się', 'to', 'jest', 'o', 'nie', 'jak', 'ale', 'za', 'od', 'po', 'tak', 'jego', 'dla', 'o', 'narciarz', 'wiązania', 'wiązanie', 'waga', 'wzrost', 'długość', 'tabela'
  ]),
  cs: new Set([
    'a', 'v', 'se', 'na', 'že', 'to', 'je', 'o', 's', 'z', 'do', 've', 'k', 'pro', 'ale', 'jak', 'po', 'od', 'lyžař', 'vázání', 'hmotnost', 'výška', 'délka', 'tabulka'
  ]),
  ja: new Set([
    'の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ', 'さ', 'ある', 'いる', 'も', 'する', 'から', 'な', 'こと', 'として', 'スキー', 'ビンディング', '体重', '身長', 'ソール長'
  ]),
};

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

export function auditHtmlFile(filePath, distDir = DIST_DIR) {
  const rel = path.relative(distDir, filePath);
  let route = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (!route.endsWith('/')) route += '/';
  if (route === '/404/') route = '/404.html';
  if (route === '/500/') route = '/500.html';

  const firstPart = route.split('/')[1];
  const locale = LOCALES.includes(firstPart) ? firstPart : 'en';

  const content = fs.readFileSync(filePath, 'utf8');
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const rawH1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  // Clean body text (strip script, style, html tags, entities)
  const cleanBody = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanBody.toLowerCase().match(/[\p{L}]+/gu) || [];
  const totalWords = words.length;

  if (locale === 'en') {
    const cleanH1 = `"${rawH1.replace(/"/g, '""')}"`;
    return {
      route,
      locale: 'en',
      detectedLang: 'en',
      pctTarget: 100,
      words: totalWords,
      h1: cleanH1,
      translatedH1: 'yes',
      targetMatches: totalWords,
      enMatches: totalWords,
    };
  }

  // Prepositions / common words shared between English and target language
  const sharedExclusions = new Set();
  if (locale === 'de') ['in', 'an'].forEach(w => sharedExclusions.add(w));
  if (locale === 'it') ['in', 'a'].forEach(w => sharedExclusions.add(w));
  if (locale === 'fr') ['a', 'en'].forEach(w => sharedExclusions.add(w));
  if (locale === 'es') ['a', 'en'].forEach(w => sharedExclusions.add(w));
  if (locale === 'nl') ['in', 'van', 'is'].forEach(w => sharedExclusions.add(w));
  if (locale === 'sv') ['i', 'på'].forEach(w => sharedExclusions.add(w));
  if (locale === 'no') ['i', 'på'].forEach(w => sharedExclusions.add(w));
  if (locale === 'pl') ['w', 'z'].forEach(w => sharedExclusions.add(w));
  if (locale === 'cs') ['v', 'z'].forEach(w => sharedExclusions.add(w));

  const strictEn = new Set([...EN_WORDS].filter(w => !sharedExclusions.has(w)));
  const targetStopwords = STOPWORDS[locale] || new Set();

  let targetMatches = 0;
  let enMatches = 0;

  words.forEach(w => {
    if (targetStopwords.has(w)) targetMatches++;
    if (strictEn.has(w)) enMatches++;
  });

  const recognized = targetMatches + enMatches;
  let pctTarget = 0;
  if (recognized > 0) {
    pctTarget = parseFloat(((targetMatches / recognized) * 100).toFixed(1));
  } else {
    // If no markers matched, inspect raw word overlap
    pctTarget = targetMatches > 0 ? 100 : 0;
  }

  const detectedLang = pctTarget >= 60.0 ? locale : 'en';

  const isEnglishH1 = rawH1.toLowerCase().includes('calculate your ski binding') ||
                      rawH1.toLowerCase().includes('page not found') ||
                      rawH1.toLowerCase().includes('boot sole length (bsl) guide') ||
                      rawH1.toLowerCase().includes('built for every skier');
  const translatedH1 = !isEnglishH1 ? 'yes' : 'no';

  const cleanH1 = `"${rawH1.replace(/"/g, '""')}"`;

  return {
    route,
    locale,
    detectedLang,
    pctTarget,
    words: totalWords,
    h1: cleanH1,
    translatedH1,
    targetMatches,
    enMatches,
  };
}

export function generateLocaleAuditCsv() {
  const files = getHtmlFiles(DIST_DIR);
  const rows = [['url', 'locale', 'detected_lang', 'pct_target_lang', 'words', 'h1', 'translated_h1'].join(',')];

  // Sort files predictably by route
  const records = files.map(f => auditHtmlFile(f)).sort((a, b) => a.route.localeCompare(b.route));

  for (const r of records) {
    rows.push([r.route, r.locale, r.detectedLang, r.pctTarget, r.words, r.h1, r.translatedH1].join(','));
  }

  const outDir = 'info/04-seo';
  fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, 'locale-audit.csv');
  fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');

  console.log(`Generated ${csvPath} with ${records.length} real audited routes.`);
  return records;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateLocaleAuditCsv();
}
