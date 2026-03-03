import Dexie, { type EntityTable } from 'dexie';
import { Project, TableSchema, Relationship } from '@/types';

const db = new Dexie('TablDesignDB') as Dexie & {
    projects: EntityTable<Project, 'id'>;
    tableSchemas: EntityTable<TableSchema, 'id'>;
    relationships: EntityTable<Relationship, 'id'>;
};

// Schema declaration – "tableSchemas" avoids colliding with Dexie's built-in .tables property
db.version(4).stores({
    projects: 'id, name, createdAt, updatedAt',
    tableSchemas: 'id, projectId, name',
    relationships: 'id, projectId, sourceTableId, targetTableId'
});

export { db };
