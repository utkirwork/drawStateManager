import { useCallback, useState, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowInstance,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import StateNode, { StateNodeData } from "./StateNode";
import { WorkflowToolbar } from "./WorkflowToolbar";
import { InspectorPanel } from "./InspectorPanel";
import { ConnectionLegend } from "./ConnectionLegend";
import { toast } from "sonner";

const nodeTypes = {
  stateNode: StateNode,
};

const initialNodes: Node<StateNodeData>[] = [
  {
    id: "1",
    type: "stateNode",
    position: { x: 250, y: 100 },
    data: { label: "Start", type: "start", description: "Initial state" },
  },
];

const initialEdges: Edge[] = [];

export const WorkflowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StateNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const nodeIdCounter = useRef(2);

  const onConnect = useCallback(
    (params: Connection) => {
      // Get source and target nodes to determine direction
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      
      // Check if this is a backward flow (target is to the left of source)
      const isBackwardFlow = sourceNode && targetNode && 
        targetNode.position.x < sourceNode.position.x;
      
      const edgeColor = isBackwardFlow 
        ? "hsl(var(--loop))" 
        : "hsl(var(--accent))";
      
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        style: { 
          stroke: edgeColor, 
          strokeWidth: isBackwardFlow ? 3 : 2.5 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
        },
        label: isBackwardFlow ? "Loop/Return" : "Transition",
        className: isBackwardFlow ? "backward-flow" : "",
      };
      setEdges((eds) => addEdge(newEdge, eds));
      toast.success(isBackwardFlow ? "Loop connection created" : "Transition created");
    },
    [setEdges, nodes]
  );

  const onNodeClick = useCallback((_: any, node: Node<StateNodeData>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const addState = useCallback(
    (type: "start" | "normal" | "end") => {
      const id = `node_${nodeIdCounter.current++}`;
      const newNode: Node<StateNodeData> = {
        id,
        type: "stateNode",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          label: `${type === "start" ? "Start" : type === "end" ? "End" : "State"} ${id}`,
          type,
          description: "",
        },
      };
      setNodes((nds) => [...nds, newNode]);
      toast.success(`${type} state added`);
    },
    [setNodes]
  );

  const onUpdateNode = useCallback(
    (nodeId: string, data: Partial<StateNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      toast.success("State updated");
    },
    [setNodes]
  );

  const onUpdateEdge = useCallback(
    (edgeId: string, data: { label?: string }) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId ? { ...edge, ...data } : edge
        )
      );
      toast.success("Transition updated");
    },
    [setEdges]
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      toast.success("State deleted");
    },
    [setNodes, setEdges]
  );

  const onDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
      toast.success("Transition deleted");
    },
    [setEdges]
  );

  const handleZoomIn = useCallback(() => {
    reactFlowInstance.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.current?.zoomOut();
  }, []);

  const handleFitView = useCallback(() => {
    reactFlowInstance.current?.fitView({ padding: 0.2 });
  }, []);

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
    setSelectedEdge(null);
    nodeIdCounter.current = 2;
    toast.success("Workflow reset");
  }, [setNodes, setEdges]);

  const handleExport = useCallback(() => {
    const workflow = {
      nodes,
      edges,
    };
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workflow.json";
    link.click();
    toast.success("Workflow exported");
  }, [nodes, edges]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const workflow = JSON.parse(event.target.result);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
          toast.success("Workflow imported");
        } catch (error) {
          toast.error("Failed to import workflow");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div>
          <h1 className="text-2xl font-bold text-foreground">StateManagerDraw</h1>
          <p className="text-sm text-muted-foreground">Visual Workflow Builder</p>
        </div>
        <ConnectionLegend />
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <WorkflowToolbar
              onAddState={addState}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
              onReset={handleReset}
              onExport={handleExport}
              onImport={handleImport}
            />
          </div>

          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              onInit={(instance) => (reactFlowInstance.current = instance)}
              nodeTypes={nodeTypes}
              fitView
              className="bg-canvas"
            >
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const data = node.data as StateNodeData;
                  switch (data.type) {
                    case "start":
                      return "hsl(var(--success))";
                    case "end":
                      return "hsl(var(--destructive))";
                    default:
                      return "hsl(var(--primary))";
                  }
                }}
                className="!bg-card !border-border"
              />
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            </ReactFlow>
          </div>
        </div>

        <InspectorPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onUpdateNode={onUpdateNode}
          onUpdateEdge={onUpdateEdge}
          onDeleteNode={onDeleteNode}
          onDeleteEdge={onDeleteEdge}
          onClose={() => {
            setSelectedNode(null);
            setSelectedEdge(null);
          }}
        />
      </div>
    </div>
  );
};
