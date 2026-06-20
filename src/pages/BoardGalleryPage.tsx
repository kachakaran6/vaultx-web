import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBoardStore } from "../store/board-store";
import { Button } from "../components/ui/button";
import { formatRelativeTime } from "../utils/date";

export function BoardGalleryPage() {
  const navigate = useNavigate();
  const { boards, loadBoards, createBoard, loading, deleteBoard } = useBoardStore();

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  const handleCreate = async () => {
    const id = await createBoard({
      name: "New Mood Board",
      description: "A blank workspace.",
      emoji: "🎨",
      cover: "",
      background: "dots"
    });
    if (id) navigate(`/boards/${id}`);
  };

  return (
    <div className="w-full pb-32 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-text">Mood Boards</h2>
          <p className="text-sm text-text-muted mt-1">Your visual productivity workspaces.</p>
        </div>
        <Button onClick={() => void handleCreate()}>
          <span className="material-symbols-outlined mr-2 text-[18px]">add</span>
          New Board
        </Button>
      </div>

      {loading && boards.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-text-muted">Loading boards...</div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-xl bg-surface-2/50">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">architecture</span>
          </div>
          <h3 className="text-lg font-semibold text-text tracking-tight">No boards yet</h3>
          <p className="text-sm text-text-muted mt-1 mb-6">Create your first infinite canvas workspace.</p>
          <Button onClick={() => void handleCreate()}>
            Create First Board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div 
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}`)}
              className="group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden cursor-pointer hover:border-accent/50 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <div className="h-32 bg-surface-2 border-b border-border flex items-center justify-center relative overflow-hidden">
                <span className="text-5xl">{board.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-text tracking-tight truncate">{board.name}</h3>
                <p className="text-xs text-text-muted mt-1 truncate">{board.description || "No description"}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-medium text-text-faint uppercase tracking-wider">
                    {board.nodes?.length || 0} items
                  </span>
                  <span className="text-[10px] text-text-faint">
                    {formatRelativeTime(board.updatedAt)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete board "${board.name}"?`)) {
                    void deleteBoard(board.id);
                  }
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-md bg-surface border border-border text-text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
