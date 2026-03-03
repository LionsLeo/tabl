export interface Project {
    id: string; // nanoid
    name: string;
    description: string;
    createdAt: number; // timestamp
    updatedAt: number;
}

export type ColumnType =
    | 'INT'
    | 'VARCHAR'
    | 'TEXT'
    | 'BOOLEAN'
    | 'DATE'
    | 'DATETIME'
    | 'DECIMAL'
    | 'FLOAT'
    | 'UUID'
    | 'JSON'
    | 'ENUM';

export interface Column {
    id: string;
    name: string;
    type: ColumnType;
    length?: number;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    isNullable: boolean;
    isUnique: boolean;
    isAutoIncrement: boolean;
    defaultValue?: string;
}

export interface TableSchema {
    id: string; // React Flow node id
    projectId: string;
    name: string;
    columns: Column[];
    position: { x: number; y: number }; // React Flow position
    color?: string; // header accent color
}

export interface Relationship {
    id: string; // React Flow edge id
    projectId: string;
    sourceTableId: string;
    sourceColumnId: string;
    targetTableId: string;
    targetColumnId: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}
