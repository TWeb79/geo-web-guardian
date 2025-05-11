
export interface GeoCheckResult {
  status: 'ok' | 'info' | 'alarm';
  icon: '✅' | 'ℹ️' | '🚨';
  details: string;
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
