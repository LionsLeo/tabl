import { ChevronLeft, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEditorStore } from '@/stores/editor-store';
import { ExportDialog } from './ExportDialog';
import { useState } from 'react';

export function EditorToolbar() {
    const router = useRouter();
    const { projectName, updateProjectName, addTable } = useEditorStore();
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(projectName);

    const handleBack = () => {
        router.push('/');
    };

    const handleNameSubmit = () => {
        if (tempName.trim()) {
            updateProjectName(tempName.trim());
        } else {
            setTempName(projectName); // Revert
        }
        setIsEditingName(false);
    };

    const handleAddTable = () => {
        // Add table to center of screen roughly
        addTable({ x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 });
    };

    return (
        <>
            <div className="h-14 border-b bg-background/95 backdrop-blur flex items-center justify-between px-4 z-10 relative">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <div className="h-4 w-px bg-border" />

                    {isEditingName ? (
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={handleNameSubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                            autoFocus
                            className="bg-transparent border-none outline-none font-semibold text-lg max-w-[200px] text-foreground"
                        />
                    ) : (
                        <h1
                            className="font-semibold text-lg cursor-pointer hover:bg-muted/50 px-2 py-1 rounded-md transition-colors"
                            onClick={() => {
                                setTempName(projectName);
                                setIsEditingName(true);
                            }}
                        >
                            {projectName || 'Loading...'}
                        </h1>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="secondary" onClick={handleAddTable} className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Table
                    </Button>
                    <Button onClick={() => setIsExportOpen(true)} className="shadow-sm shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Download className="mr-2 h-4 w-4" /> Export SQL
                    </Button>
                </div>
            </div>

            <ExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
        </>
    );
}
