import { create } from 'zustand';
import { db } from '@/lib/db';
import { Project } from '@/types';
import { nanoid } from 'nanoid';

interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    loadProjects: () => Promise<void>;
    createProject: (name: string, description: string) => Promise<string>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    isLoading: false,

    loadProjects: async () => {
        set({ isLoading: true });
        try {
            const projects = await db.projects.orderBy('updatedAt').reverse().toArray();
            set({ projects, isLoading: false });
        } catch (error) {
            console.error('Failed to load projects', error);
            set({ isLoading: false });
        }
    },

    createProject: async (name: string, description: string) => {
        const newProject: Project = {
            id: nanoid(),
            name,
            description,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        await db.projects.add(newProject);
        await get().loadProjects();
        return newProject.id;
    },

    updateProject: async (id: string, updates: Partial<Project>) => {
        await db.projects.update(id, { ...updates, updatedAt: Date.now() });
        await get().loadProjects();
    },

    deleteProject: async (id: string) => {
        // Also delete all tables and relationships belonging to this project
        await db.transaction('rw', db.projects, db.tableSchemas, db.relationships, async () => {
            await db.projects.delete(id);
            // Delete all tables belonging to this project
            const tablesToDelete = await db.tableSchemas.filter(t => t.projectId === id).toArray();
            await db.tableSchemas.bulkDelete(tablesToDelete.map(t => t.id));
            // Delete all relationships belonging to this project
            const relsToDelete = await db.relationships.filter(r => r.projectId === id).toArray();
            await db.relationships.bulkDelete(relsToDelete.map(r => r.id));
        });

        await get().loadProjects();
    },
}));
