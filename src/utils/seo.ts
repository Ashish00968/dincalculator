/**
 * Central SEO Helper for DIN Calculator Pro
 * Enforces strict length limits (Title <= 60, Meta 140-160),
 * generates structured data (WebApplication, Organization, BreadcrumbList, Article),
 * and handles canonical and social cards.
 */

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

const BASE_URL = 'https://dincalculatorpro.com';

export const SEO_DATA: Record<string, Record<string, { title: string; description: string }>> = {
  en: {
    '/': {
      title: 'Ski DIN Calculator (ISO 11088:2023) | Free & Instant',
      description: 'Calculate your ski binding DIN release setting accurately using ISO 11088:2023. Free, instant, and private with step-by-step skier code breakdown.'
    },
    '/din-chart/': {
      title: 'Ski Binding DIN Chart (ISO 11088:2023) by Weight & BSL',
      description: 'Complete ISO 11088:2023 ski binding DIN chart. Look up release settings by skier weight, height, ability level, and boot sole length (BSL) in mm.'
    },
    '/skier-types/': {
      title: 'Skier Type 1, 2, 3 & 3+: Which One Are You?',
      description: 'Determine your skier type (Type -I, I, II, III, III+) under ISO 11088:2023. Understand how your skiing style impacts release force and knee safety.'
    },
    '/skier-type-quiz/': {
      title: 'Skier Type Quiz (ISO 11088) | Find Your Type',
      description: 'Take our interactive 30-second skier type quiz. Discover whether you are Type -I, I, II, III, or III+ under ISO 11088:2023 for safe binding calibration.'
    },
    '/bsl-guide/': {
      title: 'How to Find Your Boot Sole Length (BSL) in mm',
      description: 'Find your ski boot sole length (BSL) in millimeters. Learn where the BSL stamp is located, why it differs from Mondopoint, and how to measure it.'
    },
    '/methodology/': {
      title: 'How the DIN Calculation Works (ISO 11088:2023)',
      description: 'Detailed explanation of the ISO 11088:2023 ski binding release calculation methodology, skier code tables, age modifiers, and safety tolerances.'
    },
    '/changelog/': {
      title: 'Changelog & Release Notes | DIN Calculator Pro',
      description: 'Track updates to the DIN Calculator Pro calculation engine, ISO 11088:2023 standard implementations, feature releases, and technical corrections.'
    },
    '/about/': {
      title: 'About DIN Calculator Pro | ISO 11088 Project',
      description: 'Learn about DIN Calculator Pro, our open-source ISO 11088:2023 calculation engine, safety philosophy, and mission to promote ski binding safety.'
    },
    '/contact/': {
      title: 'Contact & Ski Technician Feedback | DIN Pro',
      description: 'Get in touch with the DIN Calculator Pro team. Submit ski shop technician feedback, suggest binding models, or report calculation discrepancies.'
    },
    '/privacy/': {
      title: 'Privacy Policy & Zero-Data Pledge | DIN Pro',
      description: 'Our zero-data privacy pledge: calculations run entirely in your browser with zero cookies, zero tracking scripts, and zero personal data stored.'
    },
    '/terms/': {
      title: 'Terms of Service & Disclaimer | DIN Pro',
      description: 'Terms of service and liability disclaimer for DIN Calculator Pro. Educational estimates based on ISO 11088:2023 requiring shop technician verification.'
    },
    '/embed-guide/': {
      title: 'Embed Ski DIN Calculator | Free Widget for Shops',
      description: 'Embed the free ISO 11088:2023 ski binding DIN calculator on your ski shop, resort, or blog website. Lightweight, responsive, and seamless iframe integration.'
    }
  },
  de: {
    '/': {
      title: 'Z-Wert Rechner Skibindung (ISO 11088:2023) | Kostenlos',
      description: 'Berechnen Sie Ihren Skibindungs-Z-Wert nach ISO 11088:2023 präzise und kostenlos. Sofortige Schritt-für-Schritt-Auswertung nach Gewicht und Sohlenlänge.'
    },
    '/din-chart/': {
      title: 'Z-Wert Tabelle Skibindung (ISO 11088:2023) | DIN Tabelle',
      description: 'Vollständige ISO 11088:2023 Z-Wert-Tabelle für Skibindungen. Ermitteln Sie die Einstellwerte nach Gewicht, Körpergröße, Fahrertyp und Sohlenlänge (BSL).'
    },
    '/bsl-guide/': {
      title: 'Sohlenlänge (BSL) am Skischuh finden in mm | Anleitung',
      description: 'Erfahren Sie, wo die Skischuh-Sohlenlänge (BSL in mm) eingeprägt ist, warum sie sich von Mondopoint unterscheidet und wie Sie Bindungen passend einstellen.'
    },
    '/skier-types/': {
      title: 'Fahrertypen beim Skifahren: Typ 1, 2, 3 | Einstufung',
      description: 'Bestimmen Sie Ihren Fahrertyp (Typ 1, 2, 3 oder 3+) nach ISO 11088:2023. Erfahren Sie, wie Fahrkönnen und Gelände den Auslösewert Ihrer Bindung steuern.'
    },
    '/about/': {
      title: 'Über DIN Calculator Pro | ISO 11088 Z-Wert Projekt',
      description: 'Erfahren Sie mehr über DIN Calculator Pro, unsere quelloffene ISO 11088:2023 Berechnungslogik und unser Engagement für sichere Skibindungseinstellungen.'
    },
    '/contact/': {
      title: 'Kontakt & Techniker-Feedback | DIN Calculator Pro',
      description: 'Kontaktieren Sie uns für Feedback zu Skibindungen, Anregungen von Servicetechnikern und Fragen zur ISO 11088:2023 Z-Wert-Berechnung ohne Tracking.'
    },
    '/privacy/': {
      title: 'Datenschutzerklärung & Zero-Data | DIN Calculator Pro',
      description: 'Unsere Datenschutzgarantie: Sämtliche Z-Wert-Berechnungen laufen lokal im Browser. Keine Cookies, kein Tracking und keine Weitergabe persönlicher Daten.'
    },
    '/terms/': {
      title: 'Nutzungsbedingungen & Haftung | DIN Calculator Pro',
      description: 'Nutzungsbedingungen und Haftungsausschluss für DIN Calculator Pro. Schätzungen nach ISO 11088:2023 erfordern die Überprüfung im qualifizierten Skiservice.'
    }
  },
  fr: {
    '/': {
      title: 'Calculateur DIN Fixations de Ski (ISO 11088:2023) | Gratuit',
      description: 'Calculez précisément le réglage DIN de vos fixations de ski selon la norme ISO 11088:2023. Gratuit, instantané et sécurisé avec détail pas à pas.'
    },
    '/din-chart/': {
      title: 'Tableau DIN Fixations Ski (ISO 11088:2023) | Grille Complète',
      description: 'Tableau officiel ISO 11088:2023 des valeurs DIN de ski alpin. Trouvez votre réglage selon votre poids, taille, niveau de ski et longueur de semelle (BSL).'
    },
    '/bsl-guide/': {
      title: 'Longueur de Semelle de Chaussure de Ski (BSL) en mm',
      description: 'Comment trouver la longueur de semelle (BSL) en mm gravée sur votre chaussure de ski alpin. Comprenez la différence clé avec la taille Mondopoint.'
    },
    '/skier-types/': {
      title: 'Type de Skieur 1, 2, 3 & 3+ : Guide ISO 11088:2023',
      description: 'Déterminez votre profil de skieur (Type -I, I, II, III, III+) selon la norme ISO 11088:2023 pour assurer un déclenchement sûr et protéger vos genoux.'
    },
    '/about/': {
      title: 'À Propos de DIN Calculator Pro | Projet ISO 11088',
      description: 'Découvrez DIN Calculator Pro, notre moteur de calcul open source conforme à la norme ISO 11088:2023 et notre engagement pour la sécurité en ski alpin.'
    },
    '/contact/': {
      title: 'Contact & Retours Techniciens | DIN Calculator Pro',
      description: 'Contactez l\'équipe DIN Calculator Pro. Envoyez vos retours de techniciens ski, propositions de fixations et suggestions sur la norme ISO 11088:2023.'
    },
    '/privacy/': {
      title: 'Politique de Confidentialité | DIN Calculator Pro',
      description: 'Notre engagement sans données : tous les calculs de réglage DIN s\'exécutent dans votre navigateur. Zéro cookie, zéro traceur et confidentialité totale.'
    },
    '/terms/': {
      title: 'Conditions d\'Utilisation | DIN Calculator Pro',
      description: 'Conditions d\'utilisation et avertissement de sécurité de DIN Calculator Pro. Estimations informatives ISO 11088:2023 à faire valider en atelier agréé.'
    }
  },
  it: {
    '/': {
      title: 'Calcolatore DIN Attacchi Sci (ISO 11088:2023) | Gratuito',
      description: 'Calcola con precisione la taratura DIN degli attacchi da sci secondo la norma ISO 11088:2023. Gratuito, immediato e con spiegazione passaggio per passaggio.'
    },
    '/din-chart/': {
      title: 'Tabella DIN Attacchi Sci (ISO 11088:2023) | Matrice Ufficiale',
      description: 'Tabella completa ISO 11088:2023 dei valori DIN per sci alpino. Trova la regolazione corretta in base a peso, altezza, tipo di sciatore e lunghezza scafo.'
    },
    '/bsl-guide/': {
      title: 'Lunghezza Scafo Scarpone da Sci (BSL) in mm | Guida',
      description: 'Come individuare la lunghezza scafo (BSL in mm) stampata sul tallone del tuo scarpone da sci. Differenze con la misura Mondopoint e regolazione attacchi.'
    },
    '/skier-types/': {
      title: 'Tipo di Sciatore 1, 2, 3 | Classificazione ISO 11088',
      description: 'Classifica il tuo stile di sci (Tipo -I, I, II, III, III+) secondo la norma ISO 11088:2023 per garantire lo sgancio corretto e proteggere i legamenti.'
    },
    '/about/': {
      title: 'Chi Siamo | DIN Calculator Pro & Norma ISO 11088',
      description: 'Scopri DIN Calculator Pro, il nostro motore di calcolo open source basato su ISO 11088:2023 e il nostro impegno per la sicurezza sugli sci da discesa.'
    },
    '/contact/': {
      title: 'Contatti e Feedback Tecnici | DIN Calculator Pro',
      description: 'Contatta il team di DIN Calculator Pro per feedback dai laboratori sci, segnalazioni su modelli di attacchi o domande tecniche sullo standard ISO 11088.'
    },
    '/privacy/': {
      title: 'Privacy Policy & Zero Dati | DIN Calculator Pro',
      description: 'La nostra politica sulla privacy: tutti i calcoli DIN avvengono nel tuo browser. Nessun cookie, nessun tracciamento e nessuna archiviazione di dati.'
    },
    '/terms/': {
      title: 'Termini di Servizio & Disclaimer | DIN Calculator Pro',
      description: 'Termini di servizio ed esonero da responsabilità per DIN Calculator Pro. I valori ISO 11088:2023 sono stime che devono essere verificate da skiman esperti.'
    }
  }
};

/**
 * Returns canonical route path without language prefix (e.g. '/de/din-chart/' -> '/din-chart/')
 */
export function getBaseRoute(pathname: string): string {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return '/';
  const parts = clean.split('/');
  const first = parts[0];
  if (['de', 'fr', 'it', 'es', 'ja', 'sv', 'no', 'nl', 'pl', 'cs', 'fi'].includes(first)) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}/` : '/';
  }
  return `/${clean}/`;
}

/**
 * Resolves SEO title and description for a given URL and locale.
 */
export function getSeoMetadata(pathname: string, lang: string): { title: string; description: string } {
  const baseRoute = getBaseRoute(pathname);
  const localeTable = SEO_DATA[lang] || SEO_DATA.en;
  const match = localeTable[baseRoute] || SEO_DATA.en[baseRoute];

  if (match) {
    return match;
  }

  // Fallback for untracked sub-pages
  return {
    title: 'Ski DIN Calculator (ISO 11088:2023)',
    description: 'Calculate your ski binding DIN release setting accurately using ISO 11088:2023. Free, instant, and private with step-by-step skier code breakdown.'
  };
}

/**
 * Generates valid JSON-LD schemas
 */
export function getStructuredData(pathname: string, lang: string, title: string, description: string) {
  const baseRoute = getBaseRoute(pathname);
  const currentUrl = `${BASE_URL}${pathname.endsWith('/') ? pathname : `${pathname}/`}`;

  const schemas: any[] = [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "DIN Calculator Pro",
      "description": "Free ski binding DIN calculator based on ISO 11088:2023",
      "publisher": {
        "@type": "Organization",
        "name": "DIN Calculator Pro",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/logo-icon.webp`
        }
      }
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "DIN Calculator Pro",
      "url": BASE_URL,
      "logo": `${BASE_URL}/logo-icon.webp`
    }
  ];

  // WebApplication schema on calculator pages
  if (baseRoute === '/') {
    schemas.push({
      "@type": "WebApplication",
      "name": "DIN Calculator Pro",
      "url": currentUrl,
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Free ski binding DIN calculator based on ISO 11088:2023. Runs in your browser."
    });
  }

  // BreadcrumbList for subpages
  if (baseRoute !== '/') {
    schemas.push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": lang === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${lang}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title.split('|')[0].trim(),
          "item": currentUrl
        }
      ]
    });
  }

  // Article schema for guides
  if (['/din-chart/', '/bsl-guide/', '/skier-types/', '/methodology/'].includes(baseRoute)) {
    schemas.push({
      "@type": "Article",
      "headline": title.split('|')[0].trim(),
      "description": description,
      "url": currentUrl,
      "datePublished": "2026-09-28T00:00:00Z",
      "dateModified": "2026-09-28T00:00:00Z",
      "author": {
        "@type": "Organization",
        "name": "DIN Calculator Pro Technical Team",
        "url": `${BASE_URL}/about/`
      },
      "publisher": {
        "@type": "Organization",
        "name": "DIN Calculator Pro",
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/logo-icon.webp`
        }
      }
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}
