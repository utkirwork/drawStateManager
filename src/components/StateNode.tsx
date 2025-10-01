import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Circle, CircleCheck, CircleX } from "lucide-react";

export type StateNodeData = {
  label: string;
  type: "start" | "normal" | "end";
  description?: string;
};

const StateNode = ({ data, selected }: NodeProps<StateNodeData>) => {
  const getNodeStyles = () => {
    switch (data.type) {
      case "start":
        return "border-success bg-success/5 shadow-success/20";
      case "end":
        return "border-destructive bg-destructive/5 shadow-destructive/20";
      default:
        return "border-primary bg-primary/5 shadow-primary/20";
    }
  };

  const getIcon = () => {
    switch (data.type) {
      case "start":
        return <Circle className="h-5 w-5 text-success" />;
      case "end":
        return <CircleX className="h-5 w-5 text-destructive" />;
      default:
        return <CircleCheck className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg border-2 transition-all duration-200
        min-w-[180px] bg-card
        ${getNodeStyles()}
        ${selected ? "ring-2 ring-ring ring-offset-2 ring-offset-background shadow-lg" : "shadow-md"}
        hover:shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-accent !border-2 !border-accent-foreground/20 !w-3 !h-3"
      />
      
      <div className="flex items-center gap-2">
        {getIcon()}
        <div className="flex-1">
          <div className="font-semibold text-sm text-foreground">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs text-muted-foreground mt-1">
              {data.description}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-accent !border-2 !border-accent-foreground/20 !w-3 !h-3"
      />
    </div>
  );
};

export default memo(StateNode);
