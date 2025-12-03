// app/contact/page.js (Server Component Version - Better Performance)

import { Suspense } from "react";
import { getContactPageData } from "../../../lib/contact";
import ContactForm from "../Components/ContactForm";
import FaqSection from "./FaqSection";

export async function generateMetadata() {
  const data = await getContactPageData();
  
  if (!data?.seo) {
    return {
      title: "Contact Us",
    };
  }

  const seo = data.seo;
  
  // Build comprehensive metadata object
  const metadata = {
    title: seo.metaTitle || seo.Title || "Contact Us",
    description: seo.metaDescription || undefined,
    keywords: seo.keywords || undefined,
  };

  // Add OpenGraph metadata if needed
  if (seo.metaTitle || seo.metaDescription) {
    metadata.openGraph = {
      title: seo.metaTitle || seo.Title,
      description: seo.metaDescription || undefined,
      type: seo.ogType || 'website',
    };
  }

  // Add Twitter metadata
  if (seo.metaTitle || seo.metaDescription) {
    metadata.twitter = {
      card: 'summary_large_image',
      title: seo.metaTitle || seo.Title,
      description: seo.metaDescription || undefined,
    };
  }

  // Add robots meta
  if (seo.metaRobots) {
    metadata.robots = seo.metaRobots;
  }

  // Add canonical URL
  if (seo.canonicalURL) {
    metadata.alternates = {
      canonical: seo.canonicalURL,
    };
  }

  return metadata;
}

export default async function ContactPage() {
  const data = await getContactPageData();

  // Debug logging
  // console.log('=== Contact Page Data ===');
  // console.log('Data received:', !!data);
  // if (data) {
  //   console.log('Categories:', data.categories?.length);
  //   console.log('FAQ Data keys:', Object.keys(data.faqData));
  //   console.log('FAQ counts:', Object.entries(data.faqData).map(([key, val]) => ({
  //     category: key,
  //     count: val.length
  //   })));
  // }

  if (!data) {
    return (
      <div className="contact-container">
        <div className="contact-heading">
          <h1>Unable to load contact information</h1>
          <p style={{ color: '#999', marginTop: '20px' }}>
            Please check the browser console for error details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <div className="contact-heading">
        <h1>{data.contactTitle}</h1>
      </div>
      
      <ContactForm />
      
      <div className="contact-social">
        <Suspense fallback={<div>Loading FAQs...</div>}>
          <FaqSection 
            faqTitle={data.faqTitle}
            categories={data.categories}
            faqData={data.faqData}
          />
        </Suspense>
      </div>
    </div>
  );
}