import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Task } from '../types';
import { getTasks, getAllTasks } from '../services/api';
import { Button } from '../components/ui/Button';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import TaskListSkeleton from '../components/TaskListSkeleton';
import { TrendingUp, Plus, ArrowLeft } from 'lucide-react';

const TasksPage: React.FC<{ admin?: boolean }> = ({ admin = false }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = admin ? await getAllTasks() : await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin]);

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav className="container flex items-center justify-between p-4 mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-trading rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-trading">
              PrimeTrade
            </Link>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container p-6 mx-auto mt-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {admin ? 'All Tasks' : 'My Tasks'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {admin ? 'Manage all tasks across the platform' : 'Manage and track your personal tasks'}
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            variant="gradient"
            size="lg"
            className="gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>

        {/* Tasks List */}
        <div className="animate-fade-in">
          {loading ? (
            <TaskListSkeleton />
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleOpenModal}
              onUpdate={fetchTasks}
              isAdmin={user?.role === 'admin'}
            />
          )}
        </div>

        {/* Task Form Modal */}
        {isModalOpen && (
          <TaskForm
            task={editingTask}
            onClose={handleCloseModal}
            onUpdate={fetchTasks}
          />
        )}
      </main>
    </div>
  );
};

export default TasksPage;
