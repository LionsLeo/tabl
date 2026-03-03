import { TableSchema, Relationship, Column } from '@/types';

export interface SQLGenerator {
    generateCreateTable(table: TableSchema): string;
    generateConstraints(relationships: Relationship[], tables: TableSchema[]): string;
    generateFull(tables: TableSchema[], relationships: Relationship[]): string;
}

export function buildSQL(
    tables: TableSchema[],
    relationships: Relationship[],
    generator: SQLGenerator
): string {
    let sql = '';

    for (const table of tables) {
        sql += generator.generateCreateTable(table);
        sql += '\n\n';
    }

    const constraints = generator.generateConstraints(relationships, tables);
    if (constraints) {
        sql += constraints;
        sql += '\n';
    }

    return sql.trim();
}
