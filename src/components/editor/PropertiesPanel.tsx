import { useEditorStore } from '@/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, GripVertical, Settings2 } from 'lucide-react';
import { ColumnType } from '@/types';

const COLUMN_TYPES: ColumnType[] = [
    'INT', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATE', 'DATETIME', 'DECIMAL', 'FLOAT', 'UUID', 'JSON', 'ENUM'
];

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#3f3f46'
];

export function PropertiesPanel() {
    const {
        tables,
        relationships,
        selectedTableId,
        selectedRelationshipId,
        updateTable,
        deleteTable,
        addColumn,
        updateColumn,
        deleteColumn,
        updateRelationship,
        deleteRelationship
    } = useEditorStore();

    const activeTable = tables.find(t => t.id === selectedTableId);
    const activeRelationship = relationships.find(r => r.id === selectedRelationshipId);

    if (!activeTable && !activeRelationship) {
        return (
            <div className="w-80 border-l bg-background/50 flex flex-col items-center justify-center text-center p-6 text-muted-foreground h-full">
                <Settings2 className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select a table or relationship on the canvas to view and edit its properties.</p>
            </div>
        );
    }

    if (activeRelationship) {
        const sourceTable = tables.find(t => t.id === activeRelationship.sourceTableId);
        const targetTable = tables.find(t => t.id === activeRelationship.targetTableId);

        return (
            <div className="w-80 border-l bg-background h-full flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-semibold">Edit Relationship</h2>
                </div>
                <div className="p-4 space-y-4">
                    <div className="space-y-1 text-sm bg-muted/50 p-3 rounded border">
                        <div className="text-muted-foreground">Source</div>
                        <div className="font-medium">{sourceTable?.name || 'Unknown'}</div>
                    </div>
                    <div className="space-y-1 text-sm bg-muted/50 p-3 rounded border">
                        <div className="text-muted-foreground">Target</div>
                        <div className="font-medium">{targetTable?.name || 'Unknown'}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Relationship Type</Label>
                        <Select
                            value={activeRelationship.type}
                            onValueChange={(val: any) => updateRelationship(activeRelationship.id, { type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="one-to-one">One to One (1:1)</SelectItem>
                                <SelectItem value="one-to-many">One to Many (1:N)</SelectItem>
                                <SelectItem value="many-to-many">Many to Many (M:N)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full mt-8"
                        onClick={() => deleteRelationship(activeRelationship.id)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Relationship
                    </Button>
                </div>
            </div>
        );
    }

    if (activeTable) {
        return (
            <div className="w-80 lg:w-96 border-l bg-background h-full flex flex-col">
                {/* Table Header Section */}
                <div className="p-4 border-b space-y-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">Table Properties</h2>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteTable(activeTable.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Table Name</Label>
                        <Input
                            value={activeTable.name}
                            onChange={(e) => updateTable(activeTable.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                            placeholder="users"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Theme Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${activeTable.color === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-110'}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => updateTable(activeTable.id, { color })}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columns Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 border-b flex items-center justify-between bg-muted/20 shrink-0">
                        <h3 className="font-medium text-sm text-muted-foreground">Columns ({activeTable.columns.length})</h3>
                        <Button size="sm" variant="secondary" onClick={() => addColumn(activeTable.id)}>
                            <Plus className="w-4 h-4 mr-1" /> Add Column
                        </Button>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-2">
                            {activeTable.columns.map((col, idx) => (
                                <div key={col.id} className="bg-card border rounded-md p-3 space-y-3 relative group">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab" />
                                        <Input
                                            value={col.name}
                                            onChange={(e) => updateColumn(activeTable.id, col.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                                            className="h-8 font-medium bg-background"
                                            placeholder="column_name"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-3"
                                            onClick={() => deleteColumn(activeTable.id, col.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pl-6">
                                        <Select
                                            value={col.type}
                                            onValueChange={(val: ColumnType) => updateColumn(activeTable.id, col.id, { type: val })}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COLUMN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="number"
                                            placeholder="Length"
                                            className="h-8 text-xs"
                                            value={col.length || ''}
                                            onChange={(e) => updateColumn(activeTable.id, col.id, { length: e.target.value ? parseInt(e.target.value) : undefined })}
                                            disabled={['DATE', 'DATETIME', 'BOOLEAN', 'UUID', 'JSON'].includes(col.type)}
                                        />
                                    </div>

                                    <div className="pl-6 flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t mt-2">
                                        <Label className="flex items-center space-x-2 text-xs cursor-pointer">
                                            <Switch
                                                checked={col.isPrimaryKey}
                                                onCheckedChange={(val) => updateColumn(activeTable.id, col.id, { isPrimaryKey: val, isNullable: val ? false : col.isNullable })}
                                                className="scale-75 origin-left"
                                            />
                                            <span>PK</span>
                                        </Label>
                                        <Label className="flex items-center space-x-2 text-xs cursor-pointer">
                                            <Switch
                                                checked={col.isNullable}
                                                onCheckedChange={(val) => updateColumn(activeTable.id, col.id, { isNullable: val })}
                                                disabled={col.isPrimaryKey}
                                                className="scale-75 origin-left"
                                            />
                                            <span>Nullable</span>
                                        </Label>
                                        <Label className="flex items-center space-x-2 text-xs cursor-pointer">
                                            <Switch
                                                checked={col.isUnique}
                                                onCheckedChange={(val) => updateColumn(activeTable.id, col.id, { isUnique: val })}
                                                className="scale-75 origin-left"
                                            />
                                            <span>Unique</span>
                                        </Label>
                                        <Label className="flex items-center space-x-2 text-xs cursor-pointer">
                                            <Switch
                                                checked={col.isAutoIncrement}
                                                onCheckedChange={(val) => updateColumn(activeTable.id, col.id, { isAutoIncrement: val })}
                                                disabled={!['INT'].includes(col.type)}
                                                className="scale-75 origin-left"
                                            />
                                            <span>AI (Auto Inc)</span>
                                        </Label>
                                    </div>
                                </div>
                            ))}

                            {activeTable.columns.length === 0 && (
                                <div className="text-center p-4 text-sm text-muted-foreground border border-dashed rounded-md">
                                    No columns added yet.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        );
    }

    return null;
}
