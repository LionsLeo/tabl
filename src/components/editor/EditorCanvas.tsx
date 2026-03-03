// @ts-nocheck
import { useCallback } from 'react';
import {
    ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, Connection,
    Node, Edge
} from '@xyflow/react';
import { useEditorStore } from '@/stores/editor-store';
import { TableNode } from './TableNode';
import { RelationshipEdge } from './RelationshipEdge';
import { TableSchema } from '@/types';

const nodeTypes = {
    tableNode: TableNode,
};
const edgeTypes = {
    relationshipEdge: RelationshipEdge,
};

function EditorCanvasInner() {
    const nodes = useEditorStore(s => s.nodes);
    const edges = useEditorStore(s => s.edges);
    const onNodesChange = useEditorStore(s => s.onNodesChange);
    const onEdgesChange = useEditorStore(s => s.onEdgesChange);
    const addRelationship = useEditorStore(s => s.addRelationship);
    const setSelectedTable = useEditorStore(s => s.setSelectedTable);
    const setSelectedRelationship = useEditorStore(s => s.setSelectedRelationship);
    const onNodeDragStop = useEditorStore(s => s.onNodeDragStop);

    const onConnect = useCallback((connection: Connection) => {
        addRelationship(connection);
    }, [addRelationship]);

    const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedTable(node.id);
    }, [setSelectedTable]);

    const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
        setSelectedRelationship(edge.id);
    }, [setSelectedRelationship]);

    const handlePaneClick = useCallback(() => {
        setSelectedTable(null);
        setSelectedRelationship(null);
    }, [setSelectedTable, setSelectedRelationship]);

    const handleNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
        onNodeDragStop(node.id, node.position);
    }, [onNodeDragStop]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            onNodeDragStop={handleNodeDragStop}
            fitView
            minZoom={0.1}
            maxZoom={2}
            elevateNodesOnSelect
            proOptions={{ hideAttribution: true }}
        >
            <Background gap={24} size={2} color="var(--border)" />
            <Controls showInteractive={false} className="bg-background border shadow-sm fill-foreground text-foreground" />
            <MiniMap
                className="bg-background border shadow-sm"
                nodeColor={(n: Node) => {
                    const table = n.data as TableSchema;
                    return table?.color ? `${table.color}80` : 'var(--muted)';
                }}
                maskColor="var(--background)"
            />
        </ReactFlow>
    );
}

export function EditorCanvas() {
    return (
        <div style={{ flex: 1, height: '100%', width: '100%', position: 'relative' }}>
            <ReactFlowProvider>
                <EditorCanvasInner />
            </ReactFlowProvider>
        </div>
    );
}
