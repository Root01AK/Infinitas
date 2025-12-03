// strapi.js - API service for fetching data from Strapi

const STRAPI_BASE_URL = "http://127.0.0.1:1338/api";

/**
 * Extract text from Strapi rich text format
 */
const extractText = (richTextArray) => {
  if (!richTextArray || !Array.isArray(richTextArray)) return "";
  
  return richTextArray
    .map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map(child => child.text || "").join(" ");
      }
      return "";
    })
    .join(" ")
    .trim();
};

/**
 * Extract list items from Strapi rich text format
 */
const extractListItems = (richTextArray) => {
  if (!richTextArray || !Array.isArray(richTextArray)) return [];
  
  const items = [];
  richTextArray.forEach(block => {
    if (block.type === "list" && block.children) {
      block.children.forEach(listItem => {
        if (listItem.type === "list-item" && listItem.children) {
          const text = listItem.children.map(child => child.text || "").join(" ").trim();
          if (text) items.push(text);
        }
      });
    }
  });
  return items;
};

/**
 * Fetch services by parent service name
 */
export const fetchServicesByParent = async (parentService) => {
  try {
    const encodedService = encodeURIComponent(parentService);
    const url = `${STRAPI_BASE_URL}/services?filters[Services][ServiceTitle][$eq]=${encodedService}&populate[Services][populate][ServiceHead][populate]=*`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformStrapiData(data);
  } catch (error) {
    // console.error("Error fetching services from Strapi:", error);
    throw error;
  }
};

/**
 * Fetch all services
 */
export const fetchAllServices = async () => {
  try {
    const url = `${STRAPI_BASE_URL}/services?populate[Services][populate][ServiceHead][populate]=*`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformAllStrapiData(data);
  } catch (error) {
    // console.error("Error fetching all services from Strapi:", error);
    throw error;
  }
};

/**
 * Transform single service group from Strapi format to your app format
 */
const transformStrapiData = (strapiData) => {
  if (!strapiData.data || strapiData.data.length === 0) {
    return null;
  }

  const item = strapiData.data[0];
  
  // Get all Services arrays from the response
  const servicesArrays = item.Services || [];
  
  // Transform all service groups
  return servicesArrays.map(serviceGroup => ({
    parentId: item.id,
    parentService: serviceGroup.ServiceTitle || "",
    ServiceList: (serviceGroup.ServiceHead || []).map((service, index) => {
      // Extract description text
      const description = extractText(service.ServiceDescription);
      
      // Extract detailed description (Content list items)
      const contentItems = service.ServiceBody?.[0]?.Content 
        ? extractListItems(service.ServiceBody[0].Content)
        : [];
      
      // Extract CTA text
      const ctaText = service.ServiceBody?.[0]?.CTA 
        ? extractText(service.ServiceBody[0].CTA)
        : "";
      
      // Combine content items and CTA
      const detailedDescription = [...contentItems];
      if (ctaText) {
        detailedDescription.push(ctaText);
      }
      
      // Get image URL
      const imageData = service.ServiceImage?.[0];
      const imageUrl = imageData?.url 
        ? `${STRAPI_BASE_URL.replace('/api', '')}${imageData.url}`
        : "/placeholder-image.jpg";
      
      return {
        id: service.id || index + 1,
        title: service.ServiceTitle || "",
        section: service.ServiceTitle?.toLowerCase().replace(/\s+/g, "-") || "",
        description: description,
        detailedDescription: detailedDescription,
        imageUrl: imageUrl,
      };
    }),
  }))[0]; // Return first service group for single query
};

/**
 * Transform all services from Strapi format to your app format
 */
const transformAllStrapiData = (strapiData) => {
  if (!strapiData.data || strapiData.data.length === 0) {
    return [];
  }

  const allServiceGroups = [];
  
  strapiData.data.forEach(item => {
    // Get all Services arrays from each item
    const servicesArrays = item.Services || [];
    
    // Transform each service group
    servicesArrays.forEach(serviceGroup => {
      allServiceGroups.push({
        parentId: item.id,
        parentService: serviceGroup.ServiceTitle || "",
        ServiceList: (serviceGroup.ServiceHead || []).map((service, index) => {
          // Extract description text
          const description = extractText(service.ServiceDescription);
          
          // Extract detailed description (Content list items)
          const contentItems = service.ServiceBody?.[0]?.Content 
            ? extractListItems(service.ServiceBody[0].Content)
            : [];
          
          // Extract CTA text
          const ctaText = service.ServiceBody?.[0]?.CTA 
            ? extractText(service.ServiceBody[0].CTA)
            : "";
          
          // Combine content items and CTA
          const detailedDescription = [...contentItems];
          if (ctaText) {
            detailedDescription.push(ctaText);
          }
          
          // Get image URL
          const imageData = service.ServiceImage?.[0];
          const imageUrl = imageData?.url 
            ? `${STRAPI_BASE_URL.replace('/api', '')}${imageData.url}`
            : "/placeholder-image.jpg";
          
          return {
            id: service.id || index + 1,
            title: service.ServiceTitle || "",
            section: service.ServiceTitle?.toLowerCase().replace(/\s+/g, "-") || "",
            description: description,
            detailedDescription: detailedDescription,
            imageUrl: imageUrl,
          };
        }),
      });
    });
  });
  
  return allServiceGroups;
};

/**
 * Get service by parent ID
 */
export const fetchServiceById = async (parentId) => {
  try {
    const url = `${STRAPI_BASE_URL}/services/${parentId}?populate[Services][populate][ServiceHead][populate]=*`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformStrapiData({ data: [data.data] });
  } catch (error) {
    // console.error("Error fetching service by ID from Strapi:", error);
    throw error;
  }
};