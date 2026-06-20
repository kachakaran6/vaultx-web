import { useBoardStore } from "../../store/board-store";
import { useAppStore } from "../../store/app-store";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export function BoardLinkPicker() {
  const { isLinkPickerOpen, closeLinkPicker, addNode } = useBoardStore();
  const links = useAppStore(state => state.links);
  const [search, setSearch] = useState("");

  const filtered = links.filter(l => l.title.toLowerCase().includes(search.toLowerCase()) || l.url.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog.Root open={isLinkPickerOpen} onOpenChange={(open) => !open && closeLinkPicker()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-[100] animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-surface p-6 shadow-lg sm:rounded-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-2">
            <Dialog.Title className="text-lg font-semibold text-text tracking-tight">Add Link to Board</Dialog.Title>
            <Dialog.Description className="text-sm text-text-muted">
              Select a link from your vault to add to the canvas.
            </Dialog.Description>
          </div>
          
          <input 
            type="text" 
            placeholder="Search links..." 
            className="w-full bg-surface-2 border border-border rounded-md px-3 h-10 text-sm text-text outline-none focus:border-accent"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar pr-2">
            {filtered.map(link => (
              <div 
                key={link.id} 
                onClick={() => {
                  // Add at center of viewport
                  addNode('link', { x: window.innerWidth / 2 - 128, y: window.innerHeight / 2 - 40 }, { linkId: link.id });
                  closeLinkPicker();
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors border border-transparent hover:border-border"
              >
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`} 
                  alt="icon"
                  className="w-8 h-8 rounded bg-surface border border-border p-1 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-text truncate">{link.title}</h4>
                  <p className="text-xs text-text-muted truncate">{new URL(link.url).hostname}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-text-muted">No links found.</div>
            )}
          </div>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
