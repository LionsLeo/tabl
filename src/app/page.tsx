"use client"

import { useEffect, useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Database, Plus, Github, Layers } from "lucide-react";

export default function DashboardPage() {
  const { projects, isLoading, loadProjects } = useProjectStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">

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

      {/* ── Grid overlay (fades to transparent downward) ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, color-mix(in oklch, var(--foreground) 5%, transparent) 0px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 1px, transparent 35px),
            repeating-linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 5%, transparent) 0px, color-mix(in oklch, var(--foreground) 5%, transparent) 1px, transparent 1px, transparent 35px)
          `,
          maskImage: `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 75%)`,
          WebkitMaskImage: `linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 75%)`,
        }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 border-b border-border/50 h-14 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5 select-none">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/15">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight">tabl<span className="text-primary">.</span>design</span>
        </div>

        <a
          href="https://github.com/LionsLeo/tabl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">Open Source</span>
        </a>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:px-12 md:py-14">

        {/* Hero section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-5">
            <Layers className="w-3.5 h-3.5" />
            Visual Schema Designer
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Your Projects
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {projects.length > 0
                  ? `${projects.length} project${projects.length > 1 ? "s" : ""} — click any to open the editor`
                  : "Design, visualise, and export your database schemas."}
              </p>
            </div>
            <Button
              id="new-project-btn"
              onClick={() => setIsDialogOpen(true)}
              className="shrink-0 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-200 hover:-translate-y-px"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mb-10" />

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[148px] rounded-xl bg-muted/40 animate-pulse border border-border/50"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 px-6 rounded-2xl border border-dashed border-border bg-muted/5">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 scale-150" />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                <Database className="w-7 h-7 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">No projects yet</h2>
            <p className="text-muted-foreground text-sm text-center max-w-xs mb-7 leading-relaxed">
              Create your first project to start visualising database schemas and generating SQL.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border/40 py-5 px-6 flex items-center justify-center text-xs text-muted-foreground/60">
        <span>tabl.design — open source, runs entirely in your browser.</span>
      </footer>

      <CreateProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
