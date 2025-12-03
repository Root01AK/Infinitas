// app/industries/page.js
import React from 'react';
import { generateSEOMetadata, renderStructuredData } from "../../../lib/seo-utils";
import IndustriesClient from '../Industries/IndustriesClient';

async function fetchIndustriesData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";
  
  try {
    const response = await fetch(
      `${baseUrl}/industries?populate=*`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch industries data: ${response.statusText}`);
    }

    const json = await response.json();
    return json?.data?.[0] || null;
  } catch (error) {
    // console.error("Error fetching industries data:", error);
    return null;
  }
}

export async function generateMetadata() {
  try {
    const industriesData = await fetchIndustriesData();
    
    // ✅ Extract SEO from array (same pattern as Career & About)
    const seoData = industriesData?.SEO && industriesData.SEO.length > 0 
      ? industriesData.SEO[0] 
      : null;
    
    return generateSEOMetadata(seoData, {
      title: 'Industries We Serve - Infinitas Advisory',
      description: 'Explore the diverse industries we serve at Infinitas Advisory, from financial services and healthcare to technology and manufacturing.',
    });
  } catch (error) {
    // console.error("Error generating metadata:", error);
    return {
      title: 'Industries We Serve - Infinitas Advisory',
      description: 'Industries served by Infinitas Advisory',
    };
  }
}

export default async function IndustriesPage() {
  const industriesData = await fetchIndustriesData();
  
  const seoData = industriesData?.SEO && industriesData.SEO.length > 0 
    ? industriesData.SEO[0] 
    : null;

  return (
    <>
      {/* Render JSON-LD Structured Data */}
      {renderStructuredData(seoData)}
      
      {/* Client Component for GSAP animations and interactive features */}
      <IndustriesClient initialData={industriesData} />
    </>
  );
}