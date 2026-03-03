import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditorStore } from '@/stores/editor-store';
import { Copy, Download, Check } from 'lucide-react';
import { PostgresGenerator } from '@/lib/sql/postgres-generator';
import { MySQLGenerator } from '@/lib/sql/mysql-generator';
import { OracleGenerator } from '@/lib/sql/oracle-generator';

export function ExportDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { tables, relationships, projectName } = useEditorStore();
    const [copied, setCopied] = useState(false);
    const [engine, setEngine] = useState<'mysql' | 'postgres' | 'oracle'>('postgres');

    const sql = useMemo(() => {
        let generator;
        if (engine === 'postgres') generator = new PostgresGenerator();
        else if (engine === 'mysql') generator = new MySQLGenerator();
        else generator = new OracleGenerator();

        try {
            return generator.generateFull(tables, relationships) || '-- Add some tables first to generate SQL';
        } catch (err) {
            console.error(err);
            return '-- Error generating SQL';
        }
    }, [tables, relationships, engine]);

    const handleCopy = () => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([sql], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(projectName || 'schema').toLowerCase().replace(/\s+/g, '_')}_schema.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Export SQL Schema</DialogTitle>
                    <DialogDescription>
                        Generate SQL code to create your tables and relationships.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col gap-4 py-4">
                    <Tabs value={engine} onValueChange={(v) => setEngine(v as any)} className="w-full h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                            <TabsTrigger value="postgres">PostgreSQL</TabsTrigger>
                            <TabsTrigger value="mysql">MySQL</TabsTrigger>
                            <TabsTrigger value="oracle">Oracle</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 mt-4 relative bg-muted/30 rounded-md border overflow-hidden">
                            <pre className="p-4 h-full overflow-auto text-sm font-mono text-muted-foreground">
                                <code>{sql}</code>
                            </pre>
                        </div>
                    </Tabs>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button variant="secondary" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" /> Download .sql
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
