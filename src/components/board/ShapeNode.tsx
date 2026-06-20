import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useBoardStore } from '../../store/board-store';

export const ShapeNode = memo(({ id, data, selected }: any) => {
  const isCircle = data.shape === 'circle';
  const [isEditing, setIsEditing] = useState(false);
  const updateNodeData = useBoardStore(state => state.updateNodeData);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      className={`relative flex items-center justify-center transition-all ${isCircle ? 'rounded-full' : 'rounded-md'}`}
      style={{ 
        backgroundColor: data.color || 'var(--surface-2)',
        border: selected ? '2px solid var(--accent)' : `1px solid ${data.borderColor || 'var(--border)'}`,
        width: data.width || 100,
        height: data.height || 100,
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Handle type="source" position={Position.Top} id="top" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Left} id="left" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 rounded-full border-border bg-surface-2 opacity-0 hover:opacity-100 transition-opacity" />
      
      {isEditing ? (
        <input
          ref={inputRef}
          className="w-[80%] bg-transparent border-none text-center outline-none text-xs font-semibold text-text"
          defaultValue={data.text || ''}
          onBlur={(e) => {
            setIsEditing(false);
            updateNodeData(id, { text: e.target.value });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setIsEditing(false);
              updateNodeData(id, { text: e.currentTarget.value });
            }
          }}
        />
      ) : (
        <span className="text-xs font-semibold text-text pointer-events-none text-center px-2">
          {data.text || (data.shape === 'circle' ? 'Circle' : 'Rectangle')}
        </span>
      )}
    </div>
  );
});
