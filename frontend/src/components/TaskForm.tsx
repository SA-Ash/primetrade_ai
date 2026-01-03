import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Task } from '../types/index.js';
import { createTask, updateTask } from '../services/api.js';
import { toast } from 'react-toastify';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Label } from './ui/Label.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/Dialog.js';
import { FileText, Calendar, X } from 'lucide-react';

interface TaskFormProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Too Short!').max(120, 'Too Long!').required('Required'),
  description: Yup.string().optional(),
  due_date: Yup.date().optional().nullable(),
});

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onUpdate }) => {
  const initialValues = {
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().substring(0, 10) : '',
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {task ? '✏️ Edit Task' : '➕ Create New Task'}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={TaskSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload = { ...values, due_date: values.due_date || null };
              if (task) {
                await updateTask(task._id, payload);
                toast.success('Task updated successfully!');
              } else {
                await createTask(payload);
                toast.success('Task created successfully!');
              }
              onUpdate();
              onClose();
            } catch (error) {
              toast.error('Failed to save task.');
              console.error(error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" />
                  Task Title
                </Label>
                <Field
                  as={Input}
                  type="text"
                  name="title"
                  placeholder="Enter task title..."
                  className="text-base"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-1 text-sm text-danger-600 dark:text-danger-400 flex items-center gap-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" />
                  Description
                </Label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Add task description (optional)..."
                  rows={4}
                  className="flex w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="mt-1 text-sm text-danger-600 dark:text-danger-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  Due Date
                </Label>
                <Field
                  as={Input}
                  type="date"
                  name="due_date"
                  min={new Date().toISOString().split('T')[0]}
                  className="text-base"
                />
                <ErrorMessage
                  name="due_date"
                  component="div"
                  className="mt-1 text-sm text-danger-600 dark:text-danger-400"
                />
              </div>

              <DialogFooter className="gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Saving...</span>
                    </>
                  ) : (
                    <>{task ? 'Update Task' : 'Create Task'}</>
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
