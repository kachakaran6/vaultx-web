import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useBoardStore } from '../../store/board-store';

export const StickyNode = memo(({ id, data, selected }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const updateNodeData = useBoardStore(state => state.updateNodeData);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      className={`relative rounded-sm shadow-sm p-4 w-48 min-h-[120px] transition-all`}
      style={{ 
        backgroundColor: data.color || '#FEF08A',
        color: '#000000',
        boxShadow: selected ? '0 0 0 2px var(--accent)' : '0 1px 3px rgba(0,0,0,0.1)' 
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="source" position={Position.Top} id="top" className="w-2 h-2 rounded-full bg-black/20 border-none opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 rounded-full bg-black/20 border-none opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left" className="w-2 h-2 rounded-full bg-black/20 border-none opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 rounded-full bg-black/20 border-none opacity-0 hover:opacity-100 transition-opacity" />
      
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full h-full bg-transparent resize-none outline-none font-medium text-sm text-black"
          defaultValue={data.text || ''}
          onBlur={(e) => {
            setIsEditing(false);
            updateNodeData(id, { text: e.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsEditing(false);
              updateNodeData(id, { text: e.currentTarget.value });
            }
          }}
        />
      ) : (
        <div className="text-sm whitespace-pre-wrap font-medium cursor-text">
          {data.text || 'Double click to edit'}
        </div>
      )}
    </div>
  );
});
