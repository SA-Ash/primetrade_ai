import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { ModeToggle } from '../components/ModeToggle';
import { TrendingUp, ListTodo, CheckCircle2, Clock, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTasks } from '../services/api';
import { Task } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const { data } = await getTasks();
        const stats = {
          total: data.length,
          completed: data.filter((t: Task) => t.status === 'done').length,
          inProgress: data.filter((t: Task) => t.status === 'in_progress').length,
          pending: data.filter((t: Task) => t.status === 'pending').length,
        };
        setTaskStats(stats);
      } catch (error) {
        console.error('Failed to fetch task stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  const stats = [
    {
      title: 'Total Tasks',
      value: loading ? '...' : taskStats.total.toString(),
      icon: ListTodo,
      color: 'bg-primary-500',
      gradient: 'from-primary-500 to-primary-600',
      percentage: 100,
    },
    {
      title: 'Completed',
      value: loading ? '...' : taskStats.completed.toString(),
      icon: CheckCircle2,
      color: 'bg-success-500',
      gradient: 'from-success-500 to-success-600',
      percentage: taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0,
    },
    {
      title: 'In Progress',
      value: loading ? '...' : taskStats.inProgress.toString(),
      icon: Clock,
      color: 'bg-warning-500',
      gradient: 'from-warning-500 to-warning-600',
      percentage: taskStats.total > 0 ? (taskStats.inProgress / taskStats.total) * 100 : 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav className="container flex items-center justify-between p-4 mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-trading rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-trading">
              PrimeTrade
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                {user?.role}
              </span>
            </div>
            <ModeToggle />
            <Button onClick={logout} variant="outline" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container p-6 mx-auto mt-6 space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="relative group overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Manage your tasks and stay organized with PrimeTrade.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="gradient" size="lg" className="gap-2">
              <Link to="/tasks">
                <ListTodo className="w-5 h-5" />
                My Tasks
              </Link>
            </Button>
            {user?.role === 'admin' && (
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/admin/tasks">
                  <TrendingUp className="w-5 h-5" />
                  All Tasks (Admin)
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Task Summary */}
        {!loading && taskStats.total > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Task Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {taskStats.total}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  {taskStats.pending}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {taskStats.inProgress}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {taskStats.completed}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
