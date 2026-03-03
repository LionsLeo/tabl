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
        <div className="h-screen w-full flex flex-col bg-background overflow-hidden relative p-4 gap-4">
            {/* ── Background radial glows ── */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: `
            radial-gradient(ellipse 100% 60% at 10% -10%, color-mix(in oklch, var(--primary) 30%, transparent) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 90% 110%, color-mix(in oklch, var(--primary) 15%, transparent) 0%, transparent 60%)
          `,
                }}
            />

            <EditorToolbar />
            <div className="flex-1 flex min-h-0 relative z-10 gap-4">
                <div className="flex-1 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md shadow-lg overflow-hidden relative">
                    <EditorCanvas />
                </div>
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
