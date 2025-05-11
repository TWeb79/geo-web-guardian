
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UrlForm from "@/components/UrlForm";
import ResultCard from "@/components/ResultCard";
import ScoreDisplay from "@/components/ScoreDisplay";
import { validateUrl } from "@/services/geoValidator";
import { GeoResults } from "@/types/geo";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [results, setResults] = useState<GeoResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    
    try {
      const geoResults = await validateUrl(url);
      setResults(geoResults);
      toast({
        title: "Analysis Complete",
        description: `GEO score: ${geoResults.score}/100`,
      });
    } catch (error) {
      console.error("Error validating URL:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">GEO Validator by Torsten Weber</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Analyze and optimize your website for Generative Engine Optimization to improve visibility and context for AI-powered search engines.
            <br></br><small><i>This prototype has been developed with lovable.dev for demonstration purposes.</i></small><br></br><br></br>Let me know how you like it: <a href="https://www.linkedin.com/in/torstenweber/" target="_blank">My LinkedIn Profile</a>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Website Analysis</CardTitle>
            <CardDescription>
              Enter a URL to check its GEO compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlForm onSubmit={handleAnalyze} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg font-medium">Analyzing website...</p>
            <p className="text-muted-foreground">This may take a few moments</p>
          </div>
        )}
        
        {results && !isLoading && (
          <div className="space-y-8">
            <ScoreDisplay score={results.score} />
            
            <div>
              <h2 className="text-2xl font-bold mb-4">Detailed Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ResultCard title="Semantic HTML Structure" result={results.semanticHtml} />
                <ResultCard title="Metadata and Head Tags" result={results.metadata} />
                <ResultCard title="Structured Data" result={results.structuredData} />
                <ResultCard title="AI-Readiness" result={results.aiReadiness} />
                <ResultCard title="Accessibility & Multimodal" result={results.accessibility} />
                <ResultCard title="Crawlability & Performance" result={results.crawlability} />
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>What do these results mean?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  <span className="text-lg mr-2">OK</span>
                  <strong>OK:</strong> This aspect of your website is fully optimized for generative AI engines.
                </p>
                <p>
                  <span className="text-lg mr-2">INFO</span>
                  <strong>Information:</strong> Partially compliant or missing optional optimizations that could improve AI understanding.
                </p>
                <p>
                  <span className="text-lg mr-2">ALERT</span>
                  <strong>Alarm:</strong> This aspect needs immediate attention as it may significantly impact how AI engines interpret your content.
                </p>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Note: This analysis provides general guidance based on current GEO best practices. For a comprehensive evaluation, consider consulting with a GEO specialist.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
