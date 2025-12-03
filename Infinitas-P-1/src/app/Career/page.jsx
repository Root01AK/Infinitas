// app/career/page.js
import React from 'react';
import { fetchCareer } from "../../../lib/api";
import { generateSEOMetadata, renderStructuredData } from "../../../lib/seo-utils";
import CareerClient from './CareerClient';

export async function generateMetadata() {
  try {
    const data = await fetchCareer();
    const careerPage = data && data.length > 0 ? data[0] : null;
    
    const seoData = careerPage?.SEO && careerPage.SEO.length > 0 
      ? careerPage.SEO[0] 
      : null;
    
    return generateSEOMetadata(seoData, {
      title: 'Careers at Infinitas Advisory - Join Our Team',
      description: 'Explore career opportunities at Infinitas Advisory. We are looking for talented individuals to join our growing team.',
    });
  } catch (error) {
    // console.error("Error generating metadata:", error);
    return {
      title: 'Careers at Infinitas Advisory',
      description: 'Join our team at Infinitas Advisory',
    };
  }
}

export default async function CareerPage() {
  let careerData = null;
  let seoData = null;

  try {
    const data = await fetchCareer();
    if (data && data.length > 0) {
      const item = data[0];
      
      // Get the banner image URL
      const bannerImageUrl = item.BannerImage && item.BannerImage.length > 0
        ? item.BannerImage[0].url
        : null;
      
      careerData = {
        bannerImage: bannerImageUrl 
          ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL.replace('/api', '')}${bannerImageUrl}`
          : "/abt1.jpg",
        bannerTitle: item.Bannertitle || "Careers at Infinitas",
        buttonText: item.BannerCta || "See Open Positions",
        description: item.CareerDescription || "Currently there is No Open Positions, Mail your CV & we'll get back to you."
      };
      
      // Extract SEO data
      seoData = item.seo || item.SEO;
    }
  } catch (err) {
    // console.error("Error fetching career data:", err);
  }

  return (
    <>
      {/* Render JSON-LD Structured Data */}
      {renderStructuredData(seoData)}
      
      {/* Client Component for Interactive Features */}
      <CareerClient initialData={careerData} />
    </>
  );
}