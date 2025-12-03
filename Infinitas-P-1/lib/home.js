// utils/seo.js

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

/**
 * Fetch home page data from Strapi
 */
export async function fetchHomeData() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/homes?populate=*`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }
    
    const data = await response.json();
    return data?.data?.[0] || null;
  } catch (error) {
    // console.error('Error fetching home data:', error);
    return null;
  }
}

/**
 * Generate metadata for Next.js from Strapi SEO data
 */
export function generateMetadataFromSEO(seoData) {
  if (!seoData || !seoData.SEO || seoData.SEO.length === 0) {
    return {
      title: 'Infinitas Advisory',
      description: 'Global advisory firm',
    };
  }

  const seo = seoData.SEO[0];

  return {
    title: seo.metaTitle || seo.Title,
    description: seo.metaDescription,
    keywords: seo.keywords?.split(',').map(k => k.trim()),
    robots: {
      index: seo.metaRobots?.includes('index'),
      follow: seo.metaRobots?.includes('follow'),
    },
    openGraph: {
      title: seo.metaTitle || seo.Title,
      description: seo.metaDescription,
      url: seo.canonicalURL,
      siteName: 'Infinitas Advisory',
      type: seo.ogType || 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle || seo.Title,
      description: seo.metaDescription,
    },
    alternates: {
      canonical: seo.canonicalURL,
    },
    other: {
      'geo.region': 'AE-DU',
      'geo.placename': seo.geoCity || 'Dubai',
    },
  };
}

/**
 * Generate structured data (JSON-LD) from Strapi schema
 */
export function generateStructuredData(seoData) {
  if (!seoData || !seoData.SEO || seoData.SEO.length === 0) {
    return null;
  }

  const seo = seoData.SEO[0];
  const structuredData = [];

  // Organization Schema
  if (seo.schemaJSON) {
    structuredData.push(seo.schemaJSON);
  }

  // FAQ Schema
  if (seo.faqSchema && seo.faqSchema.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": seo.faqSchema
    });
  }

  // Breadcrumb Schema
  if (seo.breadcrumbSchema) {
    structuredData.push(seo.breadcrumbSchema);
  }

  return structuredData;
}

/**
 * Get image URL from Strapi format
 */
export function getStrapiImageUrl(imageArray) {
  if (!imageArray || imageArray.length === 0) return null;
  
  const image = imageArray[0];
  const url = image.formats?.large?.url || image.url;
  
  return url?.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}