import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

interface WorkflowToolbarProps {
  onAddState: (type: "start" | "normal" | "end") => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const WorkflowToolbar = ({
  onAddState,
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
  onExport,
  onImport,
}: WorkflowToolbarProps) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddState("start")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Start
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddState("normal")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          State
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onAddState("end")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          End
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onFitView}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onImport}>
          <Upload className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
