import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { TableSchema } from '@/types';
import { Key } from 'lucide-react';

export const TableNode = memo(({ data, selected }: NodeProps<any>) => {
    // data is the TableSchema object injected via custom node
    const table = data as TableSchema;

    return (
        <div
            className={`bg-card text-card-foreground rounded-md w-[260px] shadow-sm border overflow-hidden
        ${selected ? 'ring-2 ring-primary border-primary' : 'border-border/60 hover:border-primary/50'}
        transition-colors
      `}
        >
            <div
                className="px-3 py-2 border-b font-medium text-sm flex items-center justify-between"
                style={{
                    backgroundColor: table.color ? `${table.color}20` : 'var(--muted)',
                    borderBottomColor: table.color ? `${table.color}40` : 'var(--border)',
                }}
            >
                <div className="flex items-center space-x-2 truncate">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: table.color || 'var(--foreground)' }} />
                    <span className="truncate">{table.name}</span>
                </div>
            </div>

            <div className="p-1 space-y-0.5 max-h-[300px] overflow-y-auto w-full node-content">
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
