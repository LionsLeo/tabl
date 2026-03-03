import { TableSchema, Relationship, Column } from '@/types';
import { SQLGenerator, buildSQL } from './sql-generator';

const typeMapping: Record<string, string> = {
    INT: 'NUMBER',
    VARCHAR: 'VARCHAR2',
    TEXT: 'CLOB',
    BOOLEAN: 'NUMBER(1)',
    DATE: 'DATE',
    DATETIME: 'TIMESTAMP',
    DECIMAL: 'NUMBER',
    FLOAT: 'FLOAT',
    UUID: 'VARCHAR2(36)',
    JSON: 'CLOB',
    ENUM: 'VARCHAR2(255)',
};

export class OracleGenerator implements SQLGenerator {
    private quote(name: string): string {
        return `"${name.toUpperCase()}"`;
    }

    private generateColumnDef(col: Column): string {
        let typeStr = typeMapping[col.type] || col.type;
        if (['VARCHAR', 'DECIMAL'].includes(col.type) && col.length) {
            typeStr += `(${col.length})`;
        }

        let def = `${this.quote(col.name)} ${typeStr}`;

        if (col.isAutoIncrement && col.type === 'INT') {
            def += ' GENERATED ALWAYS AS IDENTITY';
        }

        if (!col.isNullable && !col.isPrimaryKey) def += ' NOT NULL';
        if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;

        return def;
    }

    generateCreateTable(table: TableSchema): string {
        const lines = table.columns.map(c => this.generateColumnDef(c));

        const pks = table.columns.filter(c => c.isPrimaryKey).map(c => this.quote(c.name));
        if (pks.length > 0) {
            lines.push(`CONSTRAINT "${table.name.toUpperCase()}_PK" PRIMARY KEY (${pks.join(', ')})`);
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

            sql += `ALTER TABLE ${this.quote(targetTable.name)}\n`;
            sql += `  ADD CONSTRAINT "FK_${targetTable.name.toUpperCase()}_${targetCol.name.toUpperCase()}"\n`;
            sql += `  FOREIGN KEY (${this.quote(targetCol.name)})\n`;
            sql += `  REFERENCES ${this.quote(sourceTable.name)} (${this.quote(sourceCol.name)});\n\n`;
        }

        return sql;
    }

    generateFull(tables: TableSchema[], relationships: Relationship[]): string {
        return buildSQL(tables, relationships, this);
    }
}
