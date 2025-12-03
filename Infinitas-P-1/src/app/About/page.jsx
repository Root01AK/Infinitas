// app/about/page.js
import React from 'react';
import { generateSEOMetadata, renderStructuredData } from "../../../lib/seo-utils";
import AboutClient from './AboutClient';


async function fetchAboutData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1338/api";
  
  try {
    // Try with populate=* first (simpler approach)
    const res = await fetch(
      `${baseUrl}/about-uses?populate=*`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        cache: 'no-store', // Disable cache for debugging
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      // console.error('Strapi API Error:', errorText);
      throw new Error(`Failed to fetch about data: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log('About API Response:', JSON.stringify(json, null, 2)); // Debug log
    return json?.data?.[0] || null;
  } catch (error) {
    // console.error("Error fetching about data:", error);
    return null;
  }
}


export async function generateMetadata() {
  try {
    const aboutData = await fetchAboutData();
    
    const seoData = aboutData?.SEO && aboutData.SEO.length > 0 
      ? aboutData.SEO[0] 
      : null;
    
    return generateSEOMetadata(seoData, {
      title: 'About Us - Infinitas Advisory',
      description: 'Learn about Infinitas Advisory, a multifaceted services firm specializing in Advisory, Consulting & Marketing incorporated at RAZEZ, UAE.',
    });
  } catch (error) {
    // console.error("Error generating metadata:", error);
    return {
      title: 'About Us - Infinitas Advisory',
      description: 'Learn about Infinitas Advisory',
    };
  }
}

export default async function AboutPage() {
  const aboutData = await fetchAboutData();
  
  const seoData = aboutData?.SEO && aboutData.SEO.length > 0 
    ? aboutData.SEO[0] 
    : null;

  return (
    <>
      {/* Render JSON-LD Structured Data */}
      {renderStructuredData(seoData)}
      
      {/* Client Component for GSAP animations and interactive features */}
      <AboutClient initialData={aboutData} />
    </>
  );
}