'use client';

import { Project } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Database, MoreVertical, Trash2, Edit2, Copy, Clock } from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/project-store';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const router = useRouter();
    const deleteProject = useProjectStore(state => state.deleteProject);

    const onClick = () => {
        router.push(`/editor?id=${project.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            deleteProject(project.id);
        }
    };

    const timeAgo = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });

    return (
        <div
            onClick={onClick}
            className="group relative cursor-pointer rounded-xl border border-border/60 bg-card overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-0.5"
        >
            {/* Gradient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />

            {/* Top accent line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

            {/* Body */}
            <div className="p-5 flex flex-col gap-3">

                {/* Header: icon + name + menu — all on same flex row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Icon box */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '34px',
                        height: '34px',
                        flexShrink: 0,
                        borderRadius: '8px',
                        background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
                    }}>
                        <Database style={{ width: '15px', height: '15px', color: 'var(--primary)' }} />
                    </div>

                    {/* Project name */}
                    <span style={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--foreground)',
                    }}>
                        {project.name}
                    </span>

                    {/* Menu button */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                style={{ width: '28px', height: '28px', flexShrink: 0 }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick(); }}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                <span>Open Editor</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Duplicate (Soon)</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {project.description || 'No description provided.'}
                </p>

                {/* Footer */}
                <div className="pt-3 border-t border-border/40 flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>Updated {timeAgo}</span>
                </div>
            </div>
        </div>
    );
}
