"use client"

import { useEffect, useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { CreateProjectDialog } from "@/components/dashboard/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";

export default function DashboardPage() {
  const { projects, isLoading, loadProjects } = useProjectStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b h-16 flex items-center px-6 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center space-x-2 font-bold text-lg select-none">
          <Database className="w-5 h-5 text-primary" />
          <span>tabl.design</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your database diagram projects.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
            <Plus className="mr-2 w-4 h-4" /> New Project
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse border border-border" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] border border-dashed rounded-xl border-muted-foreground/30 bg-muted/10">
            <div className="p-4 bg-muted/30 rounded-full mb-4">
              <Database className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              Create your first project to start designing beautiful database entity-relationship diagrams.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="secondary">
              <Plus className="mr-2 w-4 h-4" /> Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      <CreateProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
