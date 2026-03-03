"use client"

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";

function EditorContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get('id');
    const { loadProject, isLoading } = useEditorStore();

    useEffect(() => {
        if (projectId) {
            loadProject(projectId);
        }
    }, [projectId, loadProject]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
            <EditorToolbar />
            <div className="flex-1 flex min-h-0 relative">
                <EditorCanvas />
                <PropertiesPanel />
            </div>
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
            <EditorContent />
        </Suspense>
    );
}
