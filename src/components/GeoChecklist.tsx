
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const GeoChecklist = () => {
  const checklistItems = [
    {
      category: "Semantic HTML Structure",
      items: [
        "Use semantic HTML5 tags (header, main, footer, article, section, nav)",
        "Create logical content structure with proper heading hierarchy (h1-h6)",
        "Implement proper landmark elements for accessibility",
        "Include meaningful navigation structures"
      ]
    },
    {
      category: "Metadata & Head Tags",
      items: [
        "Include descriptive title tag with primary keyword",
        "Add comprehensive meta description with core topic and value proposition",
        "Implement canonical URLs to prevent duplicate content",
        "Add appropriate Open Graph and Twitter Card meta tags",
        "Include structured data markup for improved AI context"
      ]
    },
    {
      category: "Structured Data",
      items: [
        "Implement Schema.org JSON-LD markup for content types",
        "Include Organization, WebSite, or WebPage schema at minimum",
        "Add relevant schema types for specific content (Product, Article, FAQ, etc.)",
        "Validate structured data using testing tools",
        "Ensure all required properties are populated correctly"
      ]
    },
    {
      category: "AI-Readiness",
      items: [
        "Ensure content is clearly structured with descriptive headings",
        "Provide context for images and multimedia through alt text and captions",
        "Use descriptive anchor text for links with clear purpose",
        "Implement FAQ sections for common questions",
        "Include clear entity associations and relationships in content"
      ]
    },
    {
      category: "Accessibility & Multimodal",
      items: [
        "Add proper alt text for all images",
        "Ensure sufficient color contrast for text readability",
        "Implement keyboard navigability for all interactive elements",
        "Use ARIA attributes where appropriate",
        "Support multiple content formats (text, image, video) where appropriate"
      ]
    },
    {
      category: "Crawlability & Performance",
      items: [
        "Create clear site navigation and internal linking structure",
        "Generate and submit XML sitemaps",
        "Implement proper robots.txt file",
        "Ensure fast page load times (under 3 seconds)",
        "Optimize Core Web Vitals metrics",
        "Use proper rel attributes (nofollow, sponsored, ugc) where appropriate"
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">GEO Technical Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Use this comprehensive checklist to ensure your website is fully optimized for generative AI engines.
          </p>
          
          <div className="space-y-6">
            {checklistItems.map((category, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="mr-2 mt-1">
                        <Check className="h-4 w-4" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeoChecklist;
