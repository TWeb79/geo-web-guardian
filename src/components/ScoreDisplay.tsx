
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const [progressValue, setProgressValue] = useState(0);

  const getScoreColor = () => {
    if (score >= 80) return 'text-status-ok';
    if (score >= 60) return 'text-status-info';
    return 'text-status-alarm';
  };

  const getScoreBackground = () => {
    if (score >= 80) return 'bg-status-ok';
    if (score >= 60) return 'bg-status-info';
    return 'bg-status-alarm';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(score);
    }, 100);

    return () => clearTimeout(timer);
  }, [score]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>GEO Compliance Score</CardTitle>
        <CardDescription>
          Overall assessment of your website's GEO compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor()}`}>
              {score}/100
            </div>
            <div className="flex-1">
              <Progress value={progressValue} className={`h-2 ${getScoreBackground()}`} />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {score >= 80 ? (
              <p>Excellent! Your website is well-optimized for generative AI engines.</p>
            ) : score >= 60 ? (
              <p>Good start! Consider addressing the indicated issues to improve your GEO score.</p>
            ) : (
              <p>Your website needs significant GEO improvements to be optimized for AI engines.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreDisplay;
