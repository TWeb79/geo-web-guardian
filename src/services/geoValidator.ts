import { GeoCheckResult, GeoResults } from "@/types/geo";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function validateUrl(url: string): Promise<GeoResults> {
  const response = await fetch(url);
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const semanticStatus = validateSemanticHtml(document);
  const metadataStatus = validateMetadata(document);
  const structuredDataStatus = validateStructuredData(document);
  const aiReadinessStatus = validateAiReadiness(document);
  const accessibilityStatus = validateAccessibility(document);
  const crawlabilityStatus = validateCrawlability(document);

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
}

function validateSemanticHtml(document: Document): GeoCheckResult {
  const hasHeader = document.querySelector("header");
  const hasMain = document.querySelector("main");
  const hasFooter = document.querySelector("footer");

  if (hasHeader && hasMain && hasFooter) return result("ok", "Proper semantic layout with header, main, footer.");
  if (hasMain) return result("info", "Partial semantic tags detected, missing full layout.");
  return result("alarm", "No semantic HTML structure detected.");
}

function validateMetadata(document: Document): GeoCheckResult {
  const title = document.querySelector("title");
  const description = document.querySelector("meta[name='description']");
  const canonical = document.querySelector("link[rel='canonical']");

  if (title && description && canonical) return result("ok", "All essential metadata tags present.");
  if (title || description) return result("info", "Some essential metadata present, consider adding canonical or description.");
  return result("alarm", "Missing critical meta tags.");
}

function validateStructuredData(document: Document): GeoCheckResult {
  const scripts = Array.from(document.querySelectorAll("script[type='application/ld+json']"));
  if (scripts.length === 0) return result("alarm", "No structured data found.");
  let valid = false;
  try {
    for (const script of scripts) {
      const json = JSON.parse(script.textContent || "{}");
      if (json["@context"] && json["@type"]) {
        valid = true;
        break;
      }
    }
  } catch (e) {
    return result("alarm", "Structured data script is invalid JSON.");
  }
  return valid ? result("ok", "Valid structured data with schema.org context and type.") : result("info", "Structured data present but incomplete.");
}

function validateAiReadiness(document: Document): GeoCheckResult {
  const hasSections = document.querySelectorAll("section").length > 0;
  const hasSchemaTags = document.querySelector("[itemscope], [itemtype], [itemprop]");
  if (hasSections && hasSchemaTags) return result("ok", "AI-ready structure with schema and sectioning.");
  if (hasSections || hasSchemaTags) return result("info", "Some AI readiness features detected.");
  return result("alarm", "Content not structured for AI parsing.");
}

function validateAccessibility(document: Document): GeoCheckResult {
  const images = Array.from(document.querySelectorAll("img"));
  const missingAlt = images.filter(img => !img.hasAttribute("alt") || img.getAttribute("alt") === "").length;
  if (missingAlt === 0) return result("ok", "All images have proper alt text.");
  if (missingAlt < images.length) return result("info", "Some images missing meaningful alt text.");
  return result("alarm", "No images have proper alt text.");
}

function validateCrawlability(document: Document): GeoCheckResult {
  const preloadLinks = document.querySelectorAll("link[rel='preload']");
  const hasNav = document.querySelector("nav");
  if (preloadLinks.length > 0 && hasNav) return result("ok", "Page is crawlable with nav and preload strategies.");
  if (hasNav) return result("info", "Navigation present but missing preload directives.");
  return result("alarm", "Poor crawlability structure.");
}

function result(status: GeoCheckResult["status"], details: string): GeoCheckResult {
  const icons = { ok: "✅", info: "ℹ️", alarm: "🚨" };
  return {
    status,
    icon: icons[status],
    details,
    htmlSource: undefined,
  };
}
