import { FC, useRef, useState, useEffect } from 'react';
import { BaseEdge, EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
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
    // We need to measure the path length to do our dasharray math for the tapers
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [edgePath]);

    const relType = data?.type || 'one-to-many';
    let label = '1:N';
    if (relType === 'one-to-one') label = '1:1';
    if (relType === 'many-to-many') label = 'M:N';

    const baseStroke = selected ? 'var(--primary)' : 'var(--muted-foreground)';
    const baseWidth = selected ? 3 : 2;

    // These layers define the "tree trunk" taper effect. 
    // l = length from each end, w = thickness.
    // We stack them with rounded linecaps to create a beautifully smooth taper.
    const layers = [
        { l: 30, w: baseWidth + 1.5 },
        { l: 20, w: baseWidth + 3.0 },
        { l: 12, w: baseWidth + 5.0 },
        { l: 5, w: baseWidth + 7.5 },
    ];

    return (
        <>
            {/* Invisible path right behind the edge, just so we can read its exact pixel length */}
            <path ref={pathRef} d={edgePath} fill="none" stroke="transparent" />

            {/* The main solid/dashed thin connection line */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeWidth: baseWidth,
                    stroke: baseStroke,
                    strokeDasharray: selected ? '6 6' : 'none',
                    animation: selected ? 'dash 10s linear infinite' : 'none',
                    transition: 'stroke 0.2s',
                }}
                id={id}
            />

            {/* The overlapping tapered root layers */}
            {pathLength > 0 && layers.map((layer, i) => (
                <path
                    key={i}
                    d={edgePath}
                    fill="none"
                    stroke={baseStroke}
                    strokeWidth={layer.w}
                    strokeLinecap="round"
                    style={{
                        // This math guarantees the layer draws precisely at the start and end of the path
                        strokeDasharray: `${layer.l} ${Math.max(0, pathLength - layer.l * 2)} 99999`,
                        transition: 'stroke 0.2s',
                        pointerEvents: 'none',
                        opacity: selected ? 1 : 0.6,
                    }}
                />
            ))}

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
