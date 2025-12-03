/**
 * Generate Next.js metadata from Strapi SEO component
 * @param {Object} seoData - SEO data from Strapi
 * @param {Object} fallback - Fallback metadata if SEO data is missing
 * @returns {Object} Next.js metadata object
 */
export function generateSEOMetadata(seoData, fallback = {}) {
  if (!seoData) {
    return {
      title: fallback.title || "Default Title",
      description: fallback.description || "",
    };
  }

  const {
    title,
    metaTitle,
    metaDescription,
    keywords,
    metaImage,
    canonicalURL,
    metaRobots,
    metaViewport,
    ogType,
    schemaType,
    schemaJSON,
    faqSchema,
    breadcrumbSchema,
    businessAddress,
    businessPhone,
    geoCity
  } = seoData;

  return {
    title: metaTitle || title || fallback.title || "",
    description: metaDescription || fallback.description || "",
    
    keywords: keywords || "",

    viewport: metaViewport || "width=device-width, initial-scale=1.0",

    robots: metaRobots || "index, follow",

    alternates: {
      canonical: canonicalURL || "",
    },

    openGraph: {
      title: metaTitle || title || fallback.title || "",
      description: metaDescription || fallback.description || "",
      url: canonicalURL || "",
      type: ogType || "website",
      images: metaImage?.url ? [{ url: metaImage.url }] : [],
    },

    twitter: {
      card: "summary_large_image",
      title: metaTitle || title || fallback.title || "",
      description: metaDescription || fallback.description || "",
      images: metaImage?.url ? [metaImage.url] : [],
    },

    other: {
      ...(businessAddress && { "business:address": businessAddress }),
      ...(businessPhone && { "business:phone": businessPhone }),
      ...(geoCity && { "geo.placename": geoCity }),
      ...(schemaType && { "schema:type": schemaType }),
    },

    jsonLd: {
      schemaJSON,
      faqSchema,
      breadcrumbSchema,
    },
  };
}

import Script from "next/script";

/**
 * Render JSON-LD structured data scripts using next/script
 * These will be injected into the <head> automatically
 * @param {Object} seoData - SEO data from Strapi containing schema objects
 * @returns {JSX.Element[]} Array of Script elements
 */
export function renderStructuredData(seoData) {
  if (!seoData) return null;

  const schemas = [];

  if (seoData.schemaJSON) {
    schemas.push(
      <Script
        key="schema-main"
        id="schema-main"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoData.schemaJSON),
        }}
      />
    );
  }

  if (seoData.breadcrumbSchema) {
    schemas.push(
      <Script
        key="schema-breadcrumb"
        id="schema-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoData.breadcrumbSchema),
        }}
      />
    );
  }

  if (seoData.faqSchema) {
    schemas.push(
      <Script
        key="schema-faq"
        id="schema-faq"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seoData.faqSchema),
        }}
      />
    );
  }

  return schemas.length > 0 ? schemas : null;
}

/**
 * Fetch data from Strapi with error handling
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Fetched data
 */
export async function fetchFromStrapi(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const cleanedEndpoint = endpoint.startsWith("/api")
    ? endpoint
    : `/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const url = `${baseUrl}${cleanedEndpoint}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${endpoint}: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    // console.error(`Error fetching from Strapi (${endpoint}):`, err);
    return [];
  }
}

/**
 * Find first item with SEO data from an array
 * @param {Array} items - Array of items from Strapi
 * @returns {Object|null} First item with SEO data or null
 */
export function findItemWithSEO(items) {
  if (!Array.isArray(items)) return null;
  return items.find(item => item?.seo || item?.SEO) || null;
}
