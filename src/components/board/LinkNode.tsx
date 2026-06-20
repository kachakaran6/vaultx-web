import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useAppStore } from '../../store/app-store';

export const LinkNode = memo(({ data, selected }: any) => {
  const linkId = data.linkId;
  const link = useAppStore(state => state.links.find(l => l.id === linkId));

  if (!link) {
    return (
      <div className="bg-surface border border-danger text-danger p-2 rounded-lg text-xs shadow-sm">
        Link not found
      </div>
    );
  }

  return (
    <div className={`bg-surface border ${selected ? 'border-accent ring-1 ring-accent' : 'border-border'} rounded-lg shadow-sm p-3 w-64 transition-all`}>
      <Handle type="source" position={Position.Top} id="top" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      
      <div className="flex gap-3 items-start">
        <img 
          src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`} 
          alt="icon"
          className="w-8 h-8 rounded-md shrink-0 bg-surface-2 p-1"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text truncate">{link.title}</h3>
          <p className="text-xs text-text-muted truncate mt-0.5">{new URL(link.url).hostname}</p>
        </div>
      </div>
    </div>
  );
});
