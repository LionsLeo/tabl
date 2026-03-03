import { Project } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Database, MoreVertical, Trash2, Edit2, Copy } from 'lucide-react';
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
        <Card
            className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/5 relative overflow-hidden"
            onClick={onClick}
        >
            <CardHeader className="pb-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Database className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-base truncate max-w-[180px]">{project.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pt-4 h-[80px]">
                <CardDescription className="line-clamp-2">
                    {project.description || 'No description provided.'}
                </CardDescription>
            </CardContent>
            <CardFooter className="pt-2 pb-4 text-xs text-muted-foreground flex justify-between items-center">
                <span>Updated {timeAgo}</span>
            </CardFooter>
        </Card>
    );
}
