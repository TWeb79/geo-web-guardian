
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeoCheckResult } from "@/types/geo";

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

  return (
    <Card className="overflow-hidden border">
      <div className={`h-2 w-full ${getStatusColor()}`} />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="mr-2 text-lg">{result.icon}</span>
              <span className="font-medium">
                {result.status === 'ok' ? 'OK' : result.status === 'info' ? 'Information' : 'Alarm'}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{result.details}</p>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
