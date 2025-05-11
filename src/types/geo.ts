
export interface GeoCheckResult {
  status: 'ok' | 'info' | 'alarm';
  icon: '✅' | 'ℹ️' | '🚨';
  details: string;
  htmlSource?: string; // The relevant HTML source code where the issue was found
}

export interface GeoResults {
  semanticHtml: GeoCheckResult;
  metadata: GeoCheckResult;
  structuredData: GeoCheckResult;
  aiReadiness: GeoCheckResult;
  accessibility: GeoCheckResult;
  crawlability: GeoCheckResult;
  score: number;
}
