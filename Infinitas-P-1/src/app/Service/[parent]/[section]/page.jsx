"use server";
import React from 'react';
import { generateSEOMetadata, renderStructuredData } from "../../../../../lib/seo-utils";
import ServiceClient from './ServiceClient';
import { fetchAllServices } from "../../../../../lib/strapi";


async function fetchServicesData() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1338/api";
  
  try {
    const response = await fetch(
      `${baseUrl}/services?populate=*`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch services SEO: ${response.statusText}`);
    }

    const json = await response.json();
    return json?.data?.[0] || null;
  } catch (error) {
    console.error("Error fetching services SEO data:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  try {
    const servicesData = await fetchServicesData();
    const { parent, section } = await params;
    
    const seoData = servicesData?.SEO && servicesData.SEO.length > 0 
      ? servicesData.SEO[0] 
      : null;
    
    let title = 'Our Services - Infinitas Advisory';
    let description = 'Explore our comprehensive range of consulting and advisory services.';
    
    if (seoData) {
      title = seoData.metaTitle || seoData.Title || title;
      description = seoData.metaDescription || description;
    }
    
    // Add parent-specific info to title
    if (parent && servicesData?.Services) {
      const serviceItem = servicesData.Services.find(s => String(s.id) === parent);
      if (serviceItem?.ServiceTitle) {
        title = `${serviceItem.ServiceTitle} - ${title}`;
      }
    }
    
    return generateSEOMetadata(seoData, { title, description });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: 'Our Services - Infinitas Advisory',
      description: 'Professional consulting and advisory services',
    };
  }
}

export default async function ServicePage({ params }) {
  const servicesData = await fetchServicesData();
  const serviceGroups = await fetchAllServices();
  
  const seoData = servicesData?.SEO && servicesData.SEO.length > 0 
    ? servicesData.SEO[0] 
    : null;

  return (
    <>
      {renderStructuredData(seoData)}
      <ServiceClient 
        initialServiceGroups={serviceGroups} 
        params={params}
      />
    </>
  );
}