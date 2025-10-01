import { useState, useEffect } from "react";
import { Node, Edge } from "reactflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { StateNodeData } from "./StateNode";

interface InspectorPanelProps {
  selectedNode: Node<StateNodeData> | null;
  selectedEdge: Edge | null;
  onUpdateNode: (nodeId: string, data: Partial<StateNodeData>) => void;
  onUpdateEdge: (edgeId: string, data: { label?: string }) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onClose: () => void;
}

export const InspectorPanel = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
  onClose,
}: InspectorPanelProps) => {
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");

  useEffect(() => {
    if (selectedNode) {
      setNodeName(selectedNode.data.label);
      setNodeDescription(selectedNode.data.description || "");
    }
  }, [selectedNode]);

  useEffect(() => {
    if (selectedEdge) {
      setEdgeLabel((selectedEdge.label as string) || "");
    }
  }, [selectedEdge]);

  const handleSaveNode = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        label: nodeName,
        description: nodeDescription,
      });
    }
  };

  const handleSaveEdge = () => {
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { label: edgeLabel });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode.id);
      onClose();
    } else if (selectedEdge) {
      onDeleteEdge(selectedEdge.id);
      onClose();
    }
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-sidebar border-l border-sidebar-border p-6 flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground text-sm">
          Select a state or transition to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-l border-sidebar-border p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-sidebar-foreground">
          {selectedNode ? "State Properties" : "Transition Properties"}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="mb-4" />

      {selectedNode && (
        <div className="space-y-4">
          <div>
            <Badge
              variant={
                selectedNode.data.type === "start"
                  ? "default"
                  : selectedNode.data.type === "end"
                  ? "destructive"
                  : "secondary"
              }
              className="mb-3"
            >
              {selectedNode.data.type.toUpperCase()} STATE
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-name">State Name</Label>
            <Input
              id="node-name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Enter state name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-description">Description</Label>
            <Textarea
              id="node-description"
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              placeholder="Enter state description (optional)"
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveNode} className="flex-1">
              Save Changes
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {selectedEdge && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edge-label">Transition Name</Label>
            <Input
              id="edge-label"
              value={edgeLabel}
              onChange={(e) => setEdgeLabel(e.target.value)}
              placeholder="Enter transition name"
            />
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">From → To</p>
            <p>{selectedEdge.source} → {selectedEdge.target}</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSaveEdge} className="flex-1">
              Save Changes
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
