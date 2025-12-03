// app/case-study/page.js (or app/expertise/page.js)
import React from 'react';
import { generateSEOMetadata, renderStructuredData } from "../../../lib/seo-utils";
import CaseStudyClient from './CaseStudyClient';

// ✅ Fetch Case Study data with SEO
async function fetchCaseStudyData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1338/api";
  
  try {
    // Simpler populate approach - fetch everything
    const response = await fetch(
      `${baseUrl}/expertise?populate=*`,
      {
        next: { revalidate: 60 },
        cache: 'no-store', // Disable cache for debugging
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      // console.error('Strapi API Error:', errorText);
      throw new Error(`Failed to fetch case study data: ${response.statusText}`);
    }

    const json = await response.json();
    // console.log('Case Study API Response:', JSON.stringify(json, null, 2));
    return json?.data?.[0] || null;
  } catch (error) {
    // console.error("Error fetching case study data:", error);
    return null;
  }
}

// ✅ Generate SEO Metadata (Server Component)
export async function generateMetadata() {
  try {
    const caseStudyData = await fetchCaseStudyData();
    
    // ✅ Extract SEO from array (same pattern)
    const seoData = caseStudyData?.SEO && caseStudyData.SEO.length > 0 
      ? caseStudyData.SEO[0] 
      : null;
    
    return generateSEOMetadata(seoData, {
      title: 'Case Studies - Infinitas Advisory Success Stories',
      description: 'Explore our portfolio of successful projects and client transformations. See how Infinitas Advisory delivers measurable results across industries.',
    });
  } catch (error) {
    // console.error("Error generating metadata:", error);
    return {
      title: 'Case Studies - Infinitas Advisory',
      description: 'Success stories from Infinitas Advisory',
    };
  }
}

// ✅ Server Component - Fetch data and pass to Client
export default async function CaseStudyPage() {
  const caseStudyData = await fetchCaseStudyData();
  
  // ✅ Extract SEO data for structured data
  const seoData = caseStudyData?.SEO && caseStudyData.SEO.length > 0 
    ? caseStudyData.SEO[0] 
    : null;

  return (
    <>
      {/* Render JSON-LD Structured Data */}
      {renderStructuredData(seoData)}
      
      {/* Client Component for horizontal scroll and interactivity */}
      <CaseStudyClient initialData={caseStudyData} />
    </>
  );
}