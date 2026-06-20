import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBoardStore } from "../store/board-store";
import { ReactFlow, MiniMap, Controls, Background, BackgroundVariant, ConnectionMode } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { useTheme } from "../components/ThemeProvider";
import { LinkNode } from "../components/board/LinkNode";
import { StickyNode } from "../components/board/StickyNode";
import { ShapeNode } from "../components/board/ShapeNode";
import { BoardToolbar } from "../components/board/BoardToolbar";
import { BoardLinkPicker } from "../components/board/BoardLinkPicker";

const nodeTypes = {
  link: LinkNode,
  sticky: StickyNode,
  shape: ShapeNode,
};

export function BoardWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const { 
    activeBoard, 
    openBoard, 
    closeBoard, 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect 
  } = useBoardStore();

  useEffect(() => {
    if (id) void openBoard(id);
    return () => closeBoard();
  }, [id, openBoard, closeBoard]);

  if (!activeBoard) {
    return <div className="flex items-center justify-center h-full w-full bg-bg">Loading workspace...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-bg relative">
      <header className="h-12 bg-surface/90 backdrop-blur border-b border-border flex items-center justify-between px-4 z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/boards')}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <span className="text-lg">{activeBoard.emoji}</span>
          <h1 className="text-sm font-semibold tracking-tight text-text">{activeBoard.name}</h1>
        </div>
      </header>
      
      <div className="flex-1 w-full relative">
        <BoardToolbar />
        <BoardLinkPicker />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{ animated: true, style: { stroke: 'var(--accent)', strokeWidth: 2 } }}
          colorMode={theme as "dark" | "light" | "system"}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--border)" />
          <Controls className="bg-surface border-border fill-text text-text" />
          <MiniMap 
            className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm"
            nodeColor="var(--accent)"
            maskColor="var(--surface-2)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
