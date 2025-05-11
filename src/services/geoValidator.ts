
import { GeoCheckResult, GeoResults } from "@/types/geo";

// This is a mock implementation of a GEO validator
// In a real application, you'd need to:
// 1. Make a proxy request to fetch the website HTML
// 2. Parse the HTML and perform actual validations
// 3. Handle CORS and other security concerns

export async function validateUrl(url: string): Promise<GeoResults> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, we would fetch and analyze the actual HTML
  // For the demo, we'll return mock results based on the URL
  
  const mockResults = generateMockResults(url);
  return mockResults;
}

function generateMockResults(url: string): GeoResults {
  // Create somewhat realistic but random results
  // In a real implementation, you would analyze the actual HTML content
  
  const randomStatus = (): GeoCheckResult["status"] => {
    const rand = Math.random();
    if (rand > 0.7) return "ok";
    if (rand > 0.3) return "info";
    return "alarm";
  };

  const getStatusIcon = (status: GeoCheckResult["status"]): GeoCheckResult["icon"] => {
    switch (status) {
      case "ok": return "✅";
      case "info": return "ℹ️";
      case "alarm": return "🚨";
    }
  };

  const semanticStatus = randomStatus();
  const metadataStatus = randomStatus();
  const structuredDataStatus = randomStatus();
  const aiReadinessStatus = randomStatus();
  const accessibilityStatus = randomStatus();
  const crawlabilityStatus = randomStatus();

  // Calculate score based on the status of each category
  const calculateScore = () => {
    const statusScore = {
      ok: 100,
      info: 50,
      alarm: 0,
    };
    
    const total = [
      semanticStatus, 
      metadataStatus, 
      structuredDataStatus, 
      aiReadinessStatus, 
      accessibilityStatus, 
      crawlabilityStatus
    ].reduce((acc, status) => acc + statusScore[status], 0);
    
    return Math.round(total / 6);
  };

  return {
    semanticHtml: {
      status: semanticStatus,
      icon: getStatusIcon(semanticStatus),
      details: semanticStatus === "ok"
        ? "Good use of semantic HTML elements. All sections properly structured."
        : semanticStatus === "info"
        ? "Some semantic HTML elements present, but structure could be improved."
        : "Poor semantic structure. Missing essential HTML5 elements."
    },
    metadata: {
      status: metadataStatus,
      icon: getStatusIcon(metadataStatus),
      details: metadataStatus === "ok"
        ? "All required meta tags present including title, description, and canonical."
        : metadataStatus === "info"
        ? "Essential meta tags present, but missing AI-specific metadata."
        : "Missing critical meta tags. Title or description absent."
    },
    structuredData: {
      status: structuredDataStatus,
      icon: getStatusIcon(structuredDataStatus),
      details: structuredDataStatus === "ok"
        ? "Valid JSON-LD found with appropriate schema types and complete fields."
        : structuredDataStatus === "info"
        ? "Basic structured data present, but missing some recommended properties."
        : "No structured data found or invalid JSON-LD implementation."
    },
    aiReadiness: {
      status: aiReadinessStatus,
      icon: getStatusIcon(aiReadinessStatus),
      details: aiReadinessStatus === "ok"
        ? "Content well-structured for AI consumption with appropriate sections and fallbacks."
        : aiReadinessStatus === "info"
        ? "Basic AI readiness present, but missing advanced features like AI-specific metadata."
        : "Poor AI readiness. Content not modular or easily parseable by AI systems."
    },
    accessibility: {
      status: accessibilityStatus,
      icon: getStatusIcon(accessibilityStatus),
      details: accessibilityStatus === "ok"
        ? "All images have alt text and lazy loading implemented for non-critical assets."
        : accessibilityStatus === "info"
        ? "Basic accessibility features present, but missing some image attributes or optimizations."
        : "Poor accessibility. Missing alt text on images or proper multimodal support."
    },
    crawlability: {
      status: crawlabilityStatus,
      icon: getStatusIcon(crawlabilityStatus),
      details: crawlabilityStatus === "ok"
        ? "Excellent crawl structure with proper navigation and asset loading strategy."
        : crawlabilityStatus === "info"
        ? "Adequate crawlability, but missing preload directives or performance optimizations."
        : "Poor crawlability. JavaScript-dependent content without fallbacks or excessive load time."
    },
    score: calculateScore()
  };
}
