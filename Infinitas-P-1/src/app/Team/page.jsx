// app/team/page.js
import React from 'react';
import { generateSEOMetadata, renderStructuredData } from "../../../lib/seo-utils";
import TeamClient from './TeamClient';

// ✅ Fetch Team data with SEO
async function fetchTeamData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337/api";
  
  try {
    const response = await fetch(
      `${baseUrl}/teams?populate=*`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch team data: ${response.statusText}`);
    }

    const json = await response.json();
    return json?.data?.[0] || null;
  } catch (error) {
    // console.error("Error fetching team data:", error);
    return null;
  }
}

// ✅ Generate SEO Metadata (Server Component)
export async function generateMetadata() {
  try {
    const teamData = await fetchTeamData();
    
    // ✅ Extract SEO from array (same pattern)
    const seoData = teamData?.SEO && teamData.SEO.length > 0 
      ? teamData.SEO[0] 
      : null;
    
    return generateSEOMetadata(seoData, {
      title: 'Our Team - Infinitas Advisory',
      description: 'Meet the expert team at Infinitas Advisory. Our professionals bring decades of experience in consulting, advisory, and business transformation.',
    });
  } catch (error) {
    // console.error("Error generating metadata:", error);
    return {
      title: 'Our Team - Infinitas Advisory',
      description: 'Meet the team at Infinitas Advisory',
    };
  }
}

// ✅ Server Component - Fetch data and pass to Client
export default async function TeamPage() {
  const teamData = await fetchTeamData();
  
  // ✅ Extract SEO data for structured data
  const seoData = teamData?.SEO && teamData.SEO.length > 0 
    ? teamData.SEO[0] 
    : null;

  return (
    <>
      {/* Render JSON-LD Structured Data */}
      {renderStructuredData(seoData)}
      
      {/* Client Component for GSAP animations */}
      <TeamClient initialData={teamData} />
    </>
  );
}