
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeoCheckResult } from "@/types/geo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Info, AlarmClock } from "lucide-react";

interface ResultCardProps {
  title: string;
  result: GeoCheckResult;
}

const ResultCard = ({ title, result }: ResultCardProps) => {
  const getStatusColor = () => {
    switch (result.status) {
      case 'ok':
        return 'bg-status-ok';
      case 'info':
        return 'bg-status-info';
      case 'alarm':
        return 'bg-status-alarm';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'ok':
        return <Check className="h-5 w-5 text-status-ok" />;
      case 'info':
        return <Info className="h-5 w-5 text-status-info" />;
      case 'alarm':
        return <AlarmClock className="h-5 w-5 text-status-alarm" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (result.status) {
      case 'ok':
        return 'OK';
      case 'info':
        return 'Information';
      case 'alarm':
        return 'Alarm';
      default:
        return '';
    }
  };

  return (
    <Card className="overflow-hidden border">
      <div className={`h-2 w-full ${getStatusColor()}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="mr-2">{getStatusIcon()}</span>
              <span className="font-medium">
                {getStatusText()}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-0">
            <AccordionTrigger className="py-2 text-sm text-muted-foreground">
              View Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <p>{result.details}</p>
                </div>
                
                {result.htmlSource && result.status !== 'ok' && (
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Source Code:</p>
                    <pre className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                      <code>{result.htmlSource}</code>
                    </pre>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
