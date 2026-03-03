import { useState } from 'react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/stores/project-store';
import { useRouter } from 'next/navigation';

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createProject = useProjectStore(state => state.createProject);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const id = await createProject(name, description);
            onOpenChange(false);
            setName('');
            setDescription('');
            // Navigate to editor
            router.push(`/editor?id=${id}`);
        } catch (error) {
            console.error('Failed to create project', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create new project</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. E-commerce DB"
                                autoFocus
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly describe what this database is for..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim() || isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
