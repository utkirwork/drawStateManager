import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export const ConnectionLegend = () => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-3 space-y-2">
      <div className="text-xs font-semibold text-muted-foreground mb-2">
        Connection Types
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-8 h-0.5 bg-accent"></div>
          <ArrowRight className="h-3 w-3 text-accent" />
        </div>
        <Badge variant="secondary" className="text-xs">
          Forward Flow
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-8 h-0.5 bg-loop border-dashed" style={{ 
            backgroundImage: 'repeating-linear-gradient(to right, hsl(var(--loop)) 0, hsl(var(--loop)) 4px, transparent 4px, transparent 8px)',
            height: '3px'
          }}></div>
          <ArrowRight className="h-3 w-3 text-loop" />
        </div>
        <Badge variant="outline" className="text-xs border-loop text-loop">
          Loop/Return
        </Badge>
      </div>
    </div>
  );
};
