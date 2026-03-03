import { TableSchema, Relationship, Column } from '@/types';
import { SQLGenerator, buildSQL } from './sql-generator';

const typeMapping: Record<string, string> = {
    INT: 'INT',
    VARCHAR: 'VARCHAR',
    TEXT: 'TEXT',
    BOOLEAN: 'TINYINT(1)',
    DATE: 'DATE',
    DATETIME: 'DATETIME',
    DECIMAL: 'DECIMAL',
    FLOAT: 'FLOAT',
    UUID: 'CHAR(36)',
    JSON: 'JSON',
    ENUM: 'VARCHAR(255)',
};

export class MySQLGenerator implements SQLGenerator {
    private quote(name: string): string {
        return `\`${name}\``;
    }

    private generateColumnDef(col: Column): string {
        let typeStr = typeMapping[col.type] || col.type;
        if (['VARCHAR', 'DECIMAL'].includes(col.type) && col.length) {
            typeStr += `(${col.length})`;
        }

        let def = `${this.quote(col.name)} ${typeStr}`;

        if (!col.isNullable) def += ' NOT NULL';
        if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
        if (col.isAutoIncrement && col.type === 'INT') def += ' AUTO_INCREMENT';
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;

        return def;
    }

    generateCreateTable(table: TableSchema): string {
        const lines = table.columns.map(c => this.generateColumnDef(c));

        const pks = table.columns.filter(c => c.isPrimaryKey).map(c => this.quote(c.name));
        if (pks.length > 0) {
            lines.push(`PRIMARY KEY (${pks.join(', ')})`);
        }

        return `CREATE TABLE ${this.quote(table.name)} (\n  ${lines.join(',\n  ')}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
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
            sql += `  ADD CONSTRAINT \`fk_${targetTable.name}_${targetCol.name}\`\n`;
            sql += `  FOREIGN KEY (${this.quote(targetCol.name)})\n`;
            sql += `  REFERENCES ${this.quote(sourceTable.name)} (${this.quote(sourceCol.name)});\n\n`;
        }

        return sql;
    }

    generateFull(tables: TableSchema[], relationships: Relationship[]): string {
        return buildSQL(tables, relationships, this);
    }
}
