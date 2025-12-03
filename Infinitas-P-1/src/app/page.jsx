// app/page.js (Server Component)
import HomeClient from './Components/HomeClient';
import { fetchHomeData, generateStructuredData } from '../../lib/home';

// Generate metadata for SEO
export async function generateMetadata() {
  const homeData = await fetchHomeData();
  
  if (!homeData || !homeData.SEO || homeData.SEO.length === 0) {
    return {
      title: 'Infinitas Advisory',
      description: 'Global advisory firm',
    };
  }

  const seo = homeData.SEO[0];

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
      images: [
        {
          url: 'https://www.infinitasadvisory.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Infinitas Advisory',
        },
      ],
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

export default async function HomePage() {
  // Fetch data on server side
  const homeData = await fetchHomeData();
  
  // Generate structured data
  const structuredData = generateStructuredData(homeData);

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      {structuredData && structuredData.length > 0 && (
        <>
          {structuredData.map((schema, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
              }}
            />
          ))}
        </>
      )}

      {/* Client-side rendered components */}
      <HomeClient homeData={homeData} />
    </>
  );
}