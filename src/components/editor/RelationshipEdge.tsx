import { FC } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';
import { Relationship } from '@/types';

export const RelationshipEdge: FC<EdgeProps<any>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
    selected,
}) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 8,
    });

    const relType = data?.type || 'one-to-many';
    let label = '1:N';
    if (relType === 'one-to-one') label = '1:1';
    if (relType === 'many-to-many') label = 'M:N';

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: selected ? 3 : 2,
                    stroke: selected ? 'var(--primary)' : 'var(--muted-foreground)',
                    strokeDasharray: selected ? '4 4' : 'none',
                    animation: selected ? 'dash 10s linear infinite' : 'none',
                }}
                id={id}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className={`
            px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider shadow-sm border cursor-pointer
            ${selected ? 'bg-primary text-primary-foreground border-primary/50' : 'bg-background text-muted-foreground border-border'}
          `}
                >
                    {label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
