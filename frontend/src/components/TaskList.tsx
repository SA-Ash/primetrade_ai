import { Task } from '../types/index.js';
import { deleteTask, updateTask } from '../services/api.js';
import { toast } from 'react-toastify';
import { Button } from './ui/Button.js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select.js';
import { Calendar, Clock, Edit2, Trash2, User } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onUpdate: () => void;
  isAdmin: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onUpdate, isAdmin }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully!');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete task.');
        console.error(error);
      }
    }
  };

  const handleStatusChange = async (task: Task, status: Task['status']) => {
    try {
      await updateTask(task._id, { ...task, status });
      toast.success('Task status updated!');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update task status.');
      console.error(error);
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-500 text-white';
      case 'in_progress':
        return 'bg-primary-500 text-white';
      case 'done':
        return 'bg-success-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'done':
        return 'Completed';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
          <Clock className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
          Get started by creating your first task. Click the "New Task" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <div
          key={task._id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary-200 dark:hover:border-primary-800">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                  {task.title}
                </CardTitle>
                <span className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {task.description}
                </p>
              )}

              <div className="space-y-2">
                {task.due_date && (
                  <div className={`flex items-center gap-2 text-sm ${isOverdue(task.due_date) ? 'text-danger-600 dark:text-danger-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {isOverdue(task.due_date) && '⚠️ '}
                      Due: {new Date(task.due_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {isAdmin && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span className="font-mono text-xs truncate">{task.owner_id}</span>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="pt-2">
                <Select value={task.status} onValueChange={(value) => handleStatusChange(task, value as Task['status'])}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">📋 Pending</SelectItem>
                    <SelectItem value="in_progress">⚡ In Progress</SelectItem>
                    <SelectItem value="done">✅ Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => onEdit(task)}
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(task._id)}
                variant="destructive"
                size="sm"
                className="flex-1 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
