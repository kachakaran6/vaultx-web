import { useBoardStore } from "../../store/board-store";

export function BoardToolbar() {
  const { addNode, activeBoard, openLinkPicker, nodes, edges, setNodes, setEdges } = useBoardStore();
  
  if (!activeBoard) return null;

  const hasSelection = nodes.some(n => n.selected) || edges.some(e => e.selected);

  const handleDeleteSelection = () => {
    setNodes(nds => nds.filter(n => !n.selected));
    setEdges(eds => eds.filter(e => !e.selected));
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-surface/90 backdrop-blur-md border border-border rounded-full shadow-lg z-10">
      <button 
        onClick={() => addNode('sticky', { x: window.innerWidth / 2 - 96, y: window.innerHeight / 2 - 60 })}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
        title="Add Sticky Note"
      >
        <span className="material-symbols-outlined text-[20px]">sticky_note_2</span>
      </button>
      
      <div className="w-px h-6 bg-border mx-1"></div>
      
      <button 
        onClick={() => addNode('shape', { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 }, { shape: 'rectangle', text: 'Rectangle' })}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
        title="Add Rectangle"
      >
        <span className="material-symbols-outlined text-[20px]">rectangle</span>
      </button>

      <button 
        onClick={() => addNode('shape', { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 }, { shape: 'circle', text: 'Circle' })}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
        title="Add Circle"
      >
        <span className="material-symbols-outlined text-[20px]">circle</span>
      </button>

      <div className="w-px h-6 bg-border mx-1"></div>

      <button 
        onClick={() => openLinkPicker()}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-2 text-text-muted hover:text-text transition-colors"
        title="Add Link to Board"
      >
        <span className="material-symbols-outlined text-[20px]">link</span>
      </button>

      {hasSelection && (
        <>
          <div className="w-px h-6 bg-border mx-1"></div>
          <button 
            onClick={handleDeleteSelection}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-danger/10 text-danger transition-colors"
            title="Delete Selected (Backspace)"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </>
      )}
    </div>
  );
}
