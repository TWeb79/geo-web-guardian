
import { GeoCheckResult, GeoResults } from "@/types/geo";

export async function validateUrl(url: string): Promise<GeoResults> {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error("Could not fetch the website content");
    }
    
    const html = data.contents;
    
    // Parse the HTML content using the DOMParser (browser API)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    const semanticStatus = validateSemanticHtml(doc);
    const metadataStatus = validateMetadata(doc);
    const structuredDataStatus = validateStructuredData(doc);
    const aiReadinessStatus = validateAiReadiness(doc);
    const accessibilityStatus = validateAccessibility(doc);
    const crawlabilityStatus = validateCrawlability(doc);
    
    const calculateScore = () => {
      const statusScore = { ok: 100, info: 50, alarm: 0 };
      const total = [
        semanticStatus,
        metadataStatus,
        structuredDataStatus,
        aiReadinessStatus,
        accessibilityStatus,
        crawlabilityStatus,
      ].reduce((acc, status) => acc + statusScore[status.status], 0);
      return Math.round(total / 6);
    };
    
    return {
      semanticHtml: semanticStatus,
      metadata: metadataStatus,
      structuredData: structuredDataStatus,
      aiReadiness: aiReadinessStatus,
      accessibility: accessibilityStatus,
      crawlability: crawlabilityStatus,
      score: calculateScore(),
    };
  } catch (error) {
    console.error("Error validating URL:", error);
    // Return a default result with error state
    const errorResult: GeoCheckResult = { 
      status: 'alarm', 
      icon: 'ALERT', 
      details: `Error fetching or processing URL: ${error instanceof Error ? error.message : String(error)}` 
    };
    
    return {
      semanticHtml: errorResult,
      metadata: errorResult,
      structuredData: errorResult,
      aiReadiness: errorResult,
      accessibility: errorResult,
      crawlability: errorResult,
      score: 0,
    };
  }
}

function validateSemanticHtml(document: Document): GeoCheckResult {
  const hasHeader = document.querySelector("header");
  const hasMain = document.querySelector("main");
  const hasFooter = document.querySelector("footer");
  
  let htmlSource = '';
  
  if (!hasHeader || !hasMain || !hasFooter) {
    const bodyContent = document.body.innerHTML;
    htmlSource = bodyContent.substring(0, 200) + '...'; // Get a sample of the body
  }

  if (hasHeader && hasMain && hasFooter) return result("ok", "Proper semantic layout with header, main, footer.");
  if (hasMain) return result("info", "Partial semantic tags detected, missing full layout.", htmlSource);
  return result("alarm", "No semantic HTML structure detected.", htmlSource);
}

function validateMetadata(document: Document): GeoCheckResult {
  const title = document.querySelector("title");
  const description = document.querySelector("meta[name='description']");
  const canonical = document.querySelector("link[rel='canonical']");
  
  let htmlSource = '';
  
  if (!title || !description || !canonical) {
    const headContent = document.head.innerHTML;
    htmlSource = headContent.substring(0, 200) + '...'; // Get a sample of the head
  }

  if (title && description && canonical) return result("ok", "All essential metadata tags present.");
  if (title || description) return result("info", "Some essential metadata present, consider adding canonical or description.", htmlSource);
  return result("alarm", "Missing critical meta tags.", htmlSource);
}

function validateStructuredData(document: Document): GeoCheckResult {
  const scripts = Array.from(document.querySelectorAll("script[type='application/ld+json']"));
  
  let htmlSource = '';
  
  if (scripts.length === 0) {
    htmlSource = "<head>\n  <!-- No structured data found -->\n  ...\n</head>";
    return result("alarm", "No structured data found.", htmlSource);
  }
  
  let valid = false;
  try {
    for (const script of scripts) {
      const scriptContent = script.textContent || "";
      htmlSource = scriptContent.substring(0, 200) + '...';
      const json = JSON.parse(scriptContent || "{}");
      if (json["@context"] && json["@type"]) {
        valid = true;
        break;
      }
    }
  } catch (e) {
    return result("alarm", "Structured data script is invalid JSON.", htmlSource);
  }
  
  return valid ? result("ok", "Valid structured data with schema.org context and type.") : result("info", "Structured data present but incomplete.", htmlSource);
}

function validateAiReadiness(document: Document): GeoCheckResult {
  const hasSections = document.querySelectorAll("section").length > 0;
  const hasSchemaTags = document.querySelector("[itemscope], [itemtype], [itemprop]");
  
  let htmlSource = '';
  
  if (!hasSections || !hasSchemaTags) {
    const bodyContent = document.body.innerHTML;
    htmlSource = bodyContent.substring(0, 200) + '...';
  }
  
  if (hasSections && hasSchemaTags) return result("ok", "AI-ready structure with schema and sectioning.");
  if (hasSections || hasSchemaTags) return result("info", "Some AI readiness features detected.", htmlSource);
  return result("alarm", "Content not structured for AI parsing.", htmlSource);
}

function validateAccessibility(document: Document): GeoCheckResult {
  const images = Array.from(document.querySelectorAll("img"));
  const missingAlt = images.filter(img => !img.hasAttribute("alt") || img.getAttribute("alt") === "").length;
  
  let htmlSource = '';
  
  if (missingAlt > 0) {
    // Get the first image without alt as an example
    const badImage = images.find(img => !img.hasAttribute("alt") || img.getAttribute("alt") === "");
    if (badImage) {
      const outerHTML = badImage.outerHTML;
      htmlSource = outerHTML;
    }
  }
  
  if (missingAlt === 0) return result("ok", "All images have proper alt text.");
  if (missingAlt < images.length) return result("info", "Some images missing meaningful alt text.", htmlSource);
  return result("alarm", "No images have proper alt text.", htmlSource);
}

function validateCrawlability(document: Document): GeoCheckResult {
  const preloadLinks = document.querySelectorAll("link[rel='preload']");
  const hasNav = document.querySelector("nav");
  
  let htmlSource = '';
  
  if (!hasNav) {
    htmlSource = "<body>\n  <!-- Missing navigation elements -->\n  ...\n</body>";
  } else if (preloadLinks.length === 0) {
    const headContent = document.head.innerHTML;
    htmlSource = headContent.substring(0, 200) + '...';
  }
  
  if (preloadLinks.length > 0 && hasNav) return result("ok", "Page is crawlable with nav and preload strategies.");
  if (hasNav) return result("info", "Navigation present but missing preload directives.", htmlSource);
  return result("alarm", "Poor crawlability structure.", htmlSource);
}

function result(status: GeoCheckResult["status"], details: string, htmlSource?: string): GeoCheckResult {
  const icons: Record<GeoCheckResult["status"], "OK" | "INFO" | "ALERT"> = {
    ok: "OK",
    info: "INFO", 
    alarm: "ALERT"
  };
  return {
    status,
    icon: icons[status],
    details,
    htmlSource,
  };
}
