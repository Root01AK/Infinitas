// lib/strapi.js

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';

/**
 * Helper to extract text from Strapi rich text format
 */
export function extractText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  
  return richTextArray
    .map(block => 
      block.children
        ?.map(child => child.text)
        .join('')
    )
    .join('\n');
}

/**
 * Fetch contact data from Strapi
 */
export async function fetchContactData() {
  try {
    // Try simple populate first - Strapi v4 should handle this
    const url = `${STRAPI_URL}/api/contacts?populate=deep`;
    
    // console.log('🔍 Fetching from:', url);
    
    let res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    // If deep doesn't work, try the old way
    if (!res.ok && res.status === 400) {
      // console.log('⚠️ Deep populate failed, trying populate=*');
      const fallbackUrl = `${STRAPI_URL}/api/contacts?populate=*`;
      res = await fetch(fallbackUrl, {
        next: { revalidate: 3600 },
      });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch contact data: ${res.status}`);
    }

    const json = await res.json();
    // console.log('📦 Strapi Response received');
    // console.log('First item:', json.data?.[0] ? 'Found' : 'Not found');
    
    if (json.data?.[0]) {
      const data = json.data[0];
      // console.log('Faqstitle count:', data.Faqstitle?.length || 0);
      if (data.Faqstitle?.[0]) {
        // console.log('First category:', data.Faqstitle[0].Title);
        // console.log('FaqContent in first category:', data.Faqstitle[0].FaqContent?.length || 0);
      }
    }
    
    return json.data[0] || null;
  } catch (error) {
    // console.error('Error fetching contact data:', error);
    return null;
  }
}

/**
 * Transform Strapi FAQ data to component-friendly format
 */
export function transformFaqData(strapiData) {
  if (!strapiData?.Faqstitle) {
    // console.warn('⚠️ No Faqstitle found in data');
    return {};
  }

  const faqData = {};
  
  // console.log('🔄 Transforming FAQ data...');
  // console.log('Categories found:', strapiData.Faqstitle.length);
  
  strapiData.Faqstitle.forEach((category, idx) => {
    const categoryTitle = category.Title;
    // console.log(`\n📂 Category ${idx + 1}: "${categoryTitle}"`);
    
    faqData[categoryTitle] = [];
    
    if (category.FaqContent && Array.isArray(category.FaqContent)) {
      // console.log(`   Found ${category.FaqContent.length} FAQ items`);
      
      category.FaqContent.forEach((faq, faqIdx) => {
        const question = extractText(faq.Question);
        const answer = extractText(faq.Anwser);
        
        // console.log(`   ❓ ${faqIdx + 1}. Q: ${question.substring(0, 50)}...`);
        // console.log(`      A: ${answer.substring(0, 50)}...`);
        
        faqData[categoryTitle].push({
          q: question,
          a: answer
        });
      });
    } else {
      // console.warn(`   ⚠️ No FaqContent array found for "${categoryTitle}"`);
      // console.log('   Category structure:', JSON.stringify(category, null, 2));
    }
  });
  
  // console.log('\n✅ Final FAQ data structure:', Object.keys(faqData).map(key => ({
  //   category: key,
  //   count: faqData[key].length
  // })));
  
  return faqData;
}

/**
 * Get all contact page data (server-side optimized)
 */
export async function getContactPageData() {
  const contactData = await fetchContactData();
  
  if (!contactData) {
    return null;
  }

  return {
    contactTitle: extractText(contactData.ContactTitle),
    faqTitle: contactData.FaqTitle || "FAQ's",
    categories: contactData.Faqstitle || [],
    faqData: transformFaqData(contactData),
    seo: contactData.SEO?.[0] || null,
  };
}