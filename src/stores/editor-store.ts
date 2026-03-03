import { create } from 'zustand';
import { NodeChange, EdgeChange, Connection, Node, Edge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { db } from '@/lib/db';
import { TableSchema, Relationship, Column } from '@/types';
import { nanoid } from 'nanoid';

interface EditorState {
    projectId: string | null;
    projectName: string;
    tables: TableSchema[];
    relationships: Relationship[];
    nodes: Node[];
    edges: Edge[];
    selectedTableId: string | null;
    selectedRelationshipId: string | null;
    isLoading: boolean;

    // Actions
    loadProject: (projectId: string) => Promise<void>;
    updateProjectName: (name: string) => Promise<void>;

    // Table actions
    addTable: (position: { x: number; y: number }) => Promise<void>;
    updateTable: (id: string, updates: Partial<TableSchema>) => Promise<void>;
    deleteTable: (id: string) => Promise<void>;

    // Column actions
    addColumn: (tableId: string) => Promise<void>;
    updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => Promise<void>;
    deleteColumn: (tableId: string, columnId: string) => Promise<void>;

    // Relationship actions
    addRelationship: (connection: Connection) => Promise<void>;
    updateRelationship: (id: string, updates: Partial<Relationship>) => Promise<void>;
    deleteRelationship: (id: string) => Promise<void>;

    // Selection
    setSelectedTable: (id: string | null) => void;
    setSelectedRelationship: (id: string | null) => void;

    // React Flow handlers
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onNodeDragStop: (nodeId: string, position: { x: number; y: number }) => void;

    // Sync helpers
    syncNodesFromTables: () => void;
    syncEdgesFromRelationships: () => void;
}

// Simple debounce helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), waitFor);
    };
};

export const useEditorStore = create<EditorState>((set, get) => {
    const savePositionDebounced = debounce(async (tableId: string, position: { x: number; y: number }) => {
        await db.tableSchemas.update(tableId, { position });
    }, 500);

    return {
        projectId: null,
        projectName: '',
        tables: [],
        relationships: [],
        nodes: [],
        edges: [],
        selectedTableId: null,
        selectedRelationshipId: null,
        isLoading: true,

        loadProject: async (projectId: string) => {
            set({ isLoading: true });
            const project = await db.projects.get(projectId);
            if (!project) {
                set({ isLoading: false });
                return;
            }

            const allTables = await db.tableSchemas.toArray();
            const tables = allTables.filter(t => t.projectId === projectId);

            const allRels = await db.relationships.toArray();
            const relationships = allRels.filter(r => r.projectId === projectId);

            set({
                projectId,
                projectName: project.name,
                tables,
                relationships,
                selectedTableId: null,
                selectedRelationshipId: null,
                isLoading: false,
            });
            // Sync React Flow nodes/edges after state is set
            get().syncNodesFromTables();
            get().syncEdgesFromRelationships();
        },

        updateProjectName: async (name: string) => {
            const { projectId } = get();
            if (!projectId) return;

            await db.projects.update(projectId, { name, updatedAt: Date.now() });
            set({ projectName: name });
        },

        addTable: async (position) => {
            const { projectId, tables } = get();
            if (!projectId) return;

            const newTable: TableSchema = {
                id: nanoid(),
                projectId,
                name: `table_${tables.length + 1}`,
                position,
                columns: [
                    {
                        id: nanoid(),
                        name: 'id',
                        type: 'INT',
                        isPrimaryKey: true,
                        isForeignKey: false,
                        isNullable: false,
                        isUnique: true,
                        isAutoIncrement: true,
                    }
                ],
                color: '#3f3f46' // default gray
            };

            await db.tableSchemas.add(newTable);
            set({ tables: [...tables, newTable], selectedTableId: newTable.id, selectedRelationshipId: null });
            get().syncNodesFromTables();
        },

        updateTable: async (id, updates) => {
            const { tables } = get();
            const updatedTables = tables.map(t => t.id === id ? { ...t, ...updates } : t);
            set({ tables: updatedTables });
            get().syncNodesFromTables();
            await db.tableSchemas.update(id, updates);
        },

        deleteTable: async (id) => {
            const { tables, relationships, selectedTableId } = get();

            const newTables = tables.filter(t => t.id !== id);
            const newRels = relationships.filter(r => r.sourceTableId !== id && r.targetTableId !== id);

            set({
                tables: newTables,
                relationships: newRels,
                selectedTableId: selectedTableId === id ? null : selectedTableId
            });
            get().syncNodesFromTables();
            get().syncEdgesFromRelationships();

            await db.transaction('rw', db.tableSchemas, db.relationships, async () => {
                await db.tableSchemas.delete(id);
                const relIdsToDelete = relationships
                    .filter(r => r.sourceTableId === id || r.targetTableId === id)
                    .map(r => r.id);
                await db.relationships.bulkDelete(relIdsToDelete);
            });
        },

        addColumn: async (tableId) => {
            const { tables } = get();
            const table = tables.find(t => t.id === tableId);
            if (!table) return;

            const newColumn: Column = {
                id: nanoid(),
                name: `column_${table.columns.length + 1}`,
                type: 'VARCHAR',
                length: 255,
                isPrimaryKey: false,
                isForeignKey: false,
                isNullable: true,
                isUnique: false,
                isAutoIncrement: false,
            };

            const updatedTable = { ...table, columns: [...table.columns, newColumn] };
            await get().updateTable(tableId, updatedTable);
        },

        updateColumn: async (tableId, columnId, updates) => {
            const { tables } = get();
            const table = tables.find(t => t.id === tableId);
            if (!table) return;

            const updatedColumns = table.columns.map(c => c.id === columnId ? { ...c, ...updates } : c);
            await get().updateTable(tableId, { columns: updatedColumns });
        },

        deleteColumn: async (tableId, columnId) => {
            const { tables, relationships } = get();
            const table = tables.find(t => t.id === tableId);
            if (!table) return;

            const updatedColumns = table.columns.filter(c => c.id !== columnId);

            // Also delete any relationships attached to this column
            const relsToDelete = relationships.filter(
                r => (r.sourceTableId === tableId && r.sourceColumnId === columnId) ||
                    (r.targetTableId === tableId && r.targetColumnId === columnId)
            );

            set({
                tables: tables.map(t => t.id === tableId ? { ...t, columns: updatedColumns } : t),
                relationships: relationships.filter(r => !relsToDelete.find(d => d.id === r.id)) // Remove from state immediately
            });

            await db.transaction('rw', db.tableSchemas, db.relationships, async () => {
                await db.tableSchemas.update(tableId, { columns: updatedColumns });
                if (relsToDelete.length > 0) {
                    await db.relationships.bulkDelete(relsToDelete.map(r => r.id));
                }
            });
        },

        addRelationship: async (connection) => {
            const { projectId, relationships } = get();
            if (!projectId || !connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) return;

            // Ensure no duplicates
            const exists = relationships.some(r =>
                r.sourceTableId === connection.source &&
                r.sourceColumnId === connection.sourceHandle &&
                r.targetTableId === connection.target &&
                r.targetColumnId === connection.targetHandle
            );
            if (exists) return;

            const newRel: Relationship = {
                id: nanoid(),
                projectId,
                sourceTableId: connection.source,
                sourceColumnId: connection.sourceHandle, // Handle ID needs to be column ID
                targetTableId: connection.target,
                targetColumnId: connection.targetHandle,
                type: 'one-to-many' // Default
            };

            await db.relationships.add(newRel);
            set({ relationships: [...relationships, newRel], selectedRelationshipId: newRel.id, selectedTableId: null });
            get().syncEdgesFromRelationships();
        },

        updateRelationship: async (id, updates) => {
            const { relationships } = get();
            const updated = relationships.map(r => r.id === id ? { ...r, ...updates } : r);
            set({ relationships: updated });
            await db.relationships.update(id, updates);
        },

        deleteRelationship: async (id) => {
            const { relationships, selectedRelationshipId } = get();
            set({
                relationships: relationships.filter(r => r.id !== id),
                selectedRelationshipId: selectedRelationshipId === id ? null : selectedRelationshipId
            });
            get().syncEdgesFromRelationships();
            await db.relationships.delete(id);
        },

        setSelectedTable: (id) => {
            set({ selectedTableId: id, selectedRelationshipId: null });
            get().syncNodesFromTables();
        },
        setSelectedRelationship: (id) => {
            set({ selectedRelationshipId: id, selectedTableId: null });
            get().syncEdgesFromRelationships();
        },

        onNodesChange: (changes) => {
            // Apply ALL React Flow changes (dimensions, selection, position, etc.)
            const { nodes } = get();
            const updatedNodes = applyNodeChanges(changes, nodes);
            set({ nodes: updatedNodes });

            // Also sync position changes back to tables state
            for (const change of changes) {
                if (change.type === 'position' && change.position) {
                    const { tables } = get();
                    const newTables = tables.map(t => {
                        if (t.id === change.id) {
                            return { ...t, position: change.position! };
                        }
                        return t;
                    });
                    set({ tables: newTables });
                }
            }
        },

        onEdgesChange: (changes) => {
            const { edges } = get();
            const updatedEdges = applyEdgeChanges(changes, edges);
            set({ edges: updatedEdges });

            for (const change of changes) {
                if (change.type === 'remove') {
                    get().deleteRelationship(change.id);
                }
            }
        },

        onNodeDragStop: (nodeId, position) => {
            // Persist position to DB
            savePositionDebounced(nodeId, position);
        },

        syncNodesFromTables: () => {
            const { tables, selectedTableId } = get();
            const newNodes: Node[] = tables.map((t) => ({
                id: t.id,
                type: 'tableNode',
                position: t.position,
                data: { ...t },
                selected: t.id === selectedTableId,
            }));
            set({ nodes: newNodes });
        },

        syncEdgesFromRelationships: () => {
            const { relationships, selectedRelationshipId } = get();
            const newEdges: Edge[] = relationships.map((r) => ({
                id: r.id,
                type: 'relationshipEdge',
                source: r.sourceTableId,
                target: r.targetTableId,
                sourceHandle: r.sourceColumnId,
                targetHandle: r.targetColumnId,
                data: { ...r },
                selected: r.id === selectedRelationshipId,
            }));
            set({ edges: newEdges });
        },
    };
});
