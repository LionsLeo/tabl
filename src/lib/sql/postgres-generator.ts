import { TableSchema, Relationship, Column } from '@/types';
import { SQLGenerator, buildSQL } from './sql-generator';

const typeMapping: Record<string, string> = {
    INT: 'INTEGER',
    VARCHAR: 'VARCHAR',
    TEXT: 'TEXT',
    BOOLEAN: 'BOOLEAN',
    DATE: 'DATE',
    DATETIME: 'TIMESTAMP',
    DECIMAL: 'DECIMAL',
    FLOAT: 'DOUBLE PRECISION',
    UUID: 'UUID',
    JSON: 'JSONB',
    ENUM: 'VARCHAR', // Simplified for generic generation
};

export class PostgresGenerator implements SQLGenerator {
    private quote(name: string): string {
        return `"${name}"`;
    }

    private generateColumnDef(col: Column): string {
        let def = `${this.quote(col.name)} `;

        if (col.isAutoIncrement && col.type === 'INT') {
            def += 'SERIAL';
        } else {
            let typeStr = typeMapping[col.type] || col.type;
            if (['VARCHAR', 'DECIMAL'].includes(col.type) && col.length) {
                typeStr += `(${col.length})`;
            }
            def += typeStr;
        }

        if (!col.isNullable) def += ' NOT NULL';
        if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;

        return def;
    }

    generateCreateTable(table: TableSchema): string {
        const lines = table.columns.map(c => this.generateColumnDef(c));

        const pks = table.columns.filter(c => c.isPrimaryKey).map(c => this.quote(c.name));
        if (pks.length > 0) {
            lines.push(`PRIMARY KEY (${pks.join(', ')})`);
        }

        return `CREATE TABLE ${this.quote(table.name)} (\n  ${lines.join(',\n  ')}\n);`;
    }

    generateConstraints(relationships: Relationship[], tables: TableSchema[]): string {
        let sql = '';

        for (const rel of relationships) {
            const sourceTable = tables.find(t => t.id === rel.sourceTableId);
            const targetTable = tables.find(t => t.id === rel.targetTableId);

            if (!sourceTable || !targetTable) continue;

            const sourceCol = sourceTable.columns.find(c => c.id === rel.sourceColumnId);
            const targetCol = targetTable.columns.find(c => c.id === rel.targetColumnId);

            if (!sourceCol || !targetCol) continue;

            // In a 1:N relationship drawn from Source to Target, Target usually holds the Foreign Key points to Source PK.
            // But in our UI, it's easier to assume the node where the edge originates (Source) is the parent (1 side) 
            // and the Target is the child (N side) holding the FK. Let's write standard FK: Target(Col) references Source(Col).
            // If it's 1:1, usually target holds FK and adds UNIQUE.

            sql += `ALTER TABLE ${this.quote(targetTable.name)}\n`;
            sql += `  ADD CONSTRAINT "fk_${targetTable.name}_${targetCol.name}"\n`;
            sql += `  FOREIGN KEY (${this.quote(targetCol.name)})\n`;
            sql += `  REFERENCES ${this.quote(sourceTable.name)} (${this.quote(sourceCol.name)});\n\n`;
        }

        return sql;
    }

    generateFull(tables: TableSchema[], relationships: Relationship[]): string {
        return buildSQL(tables, relationships, this);
    }
}
