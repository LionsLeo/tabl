import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { TableSchema } from '@/types';
import { Key } from 'lucide-react';

export const TableNode = memo(({ data, selected }: NodeProps<any>) => {
    // data is the TableSchema object injected via custom node
    const table = data as TableSchema;

    return (
        <div
            className={`group relative bg-card text-card-foreground rounded-xl w-[260px] overflow-hidden transition-all duration-200
        ${selected ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary' : 'border-border/60 hover:border-primary/50 shadow-sm'}
        border
      `}
        >
            {/* Gradient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

            {/* Top accent line */}
            <div className={`h-[2px] w-full ${table.color ? '' : 'bg-gradient-to-r from-primary/80 via-primary/40 to-transparent'}`} style={{ backgroundColor: table.color }} />

            <div
                className="px-4 py-3 border-b font-semibold text-sm flex items-center justify-between bg-muted/10"
                style={{
                    borderBottomColor: table.color ? `${table.color}30` : 'var(--border)',
                }}
            >
                <div className="flex items-center space-x-2.5 truncate">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: table.color || 'var(--foreground)' }} />
                    <span className="truncate tracking-tight">{table.name}</span>
                </div>
            </div>

            <div className="p-1.5 space-y-0.5 max-h-[300px] overflow-y-auto w-full node-content relative z-10 bg-background/30 backdrop-blur-sm">
                {table.columns.map((col) => (
                    <div
                        key={col.id}
                        className="flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 rounded-sm group relative"
                    >
                        {/* Left Handle (Target) */}
                        <Handle
                            type="target"
                            position={Position.Left}
                            id={col.id}
                            className={`w-2 h-2 !bg-primary border-0 -left-[5px] transition-opacity ${selected || col.isForeignKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        />

                        <div className="flex items-center gap-2 overflow-hidden w-full">
                            {col.isPrimaryKey ? (
                                <Key className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                            ) : col.isForeignKey ? (
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/50 shrink-0" />
                            ) : (
                                <div className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="text-xs truncate font-medium">{col.name}</span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-[10px] text-muted-foreground uppercase opacity-70 border px-1 rounded bg-muted/30">
                                {col.type.toLowerCase()}{col.length ? `(${col.length})` : ''}
                            </span>
                        </div>

                        {/* Right Handle (Source) */}
                        <Handle
                            type="source"
                            position={Position.Right}
                            id={col.id}
                            className={`w-2 h-2 !bg-primary border-0 -right-[5px] transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});

TableNode.displayName = 'TableNode';
