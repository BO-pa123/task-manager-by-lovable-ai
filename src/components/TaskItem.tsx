import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, AlertCircle, Circle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const priorityIcons = {
  low: Circle,
  medium: Minus,
  high: AlertCircle
};

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-destructive/10 text-destructive'
};

export function TaskItem({ task, onToggle, onDelete, loading = false }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const PriorityIcon = priorityIcons[task.priority];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.completed && "opacity-70"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(task.id, !!checked)}
            disabled={loading}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "font-medium text-sm truncate",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <Badge 
                variant="secondary" 
                className={cn("text-xs", priorityColors[task.priority])}
              >
                <PriorityIcon className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className={cn(
                "text-xs text-muted-foreground line-clamp-2",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              Created {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading || isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}