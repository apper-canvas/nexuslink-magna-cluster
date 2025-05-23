import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import TaskForm from '../components/TaskForm';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '../services/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters = {
          searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined
        };
        const data = await getTasks(filters);
        setTasks(data);
        setFilteredTasks(data);
      } catch (err) {
        setError('Failed to fetch tasks. Please try again later.');
        toast.error('Error loading tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);
  
  // Apply filters whenever tasks, search term, or filters change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    // Sort by due date (closest first)
    result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter, priorityFilter]);
  
  const handleAddTask = async (taskData) => {
    try {
      setIsLoading(true);
      
      // Prepare task data for API
      const apiTaskData = {
        Name: taskData.title, // Name field is required
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate instanceof Date ? 
          taskData.dueDate.toISOString().split('T')[0] : 
          taskData.dueDate,
        priority: taskData.priority,
        category: taskData.category,
        status: taskData.status
      };
      
      // Call API to create task
      const newTask = await createTask(apiTaskData);
      
      // Update state with new task
      setTasks(prev => [...prev, newTask]);
      setIsAddingTask(false);
      
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateTask = async (taskData) => {
    try {
      setIsLoading(true);
      
      // Prepare task data for API
      const apiTaskData = {
        Name: taskData.title,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate instanceof Date ? 
          taskData.dueDate.toISOString().split('T')[0] : 
          taskData.dueDate,
        priority: taskData.priority,
        category: taskData.category,
        status: taskData.status
      };
      
      // Call API to update task
      const updatedTask = await updateTask(isEditingTask.Id, apiTaskData);
      
      // Update state with updated task
      setTasks(prev => prev.map(task => task.Id === isEditingTask.Id ? updatedTask : task));
      setIsEditingTask(null);
      
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsLoading(true);
        await deleteTask(id);
        setTasks(prev => prev.filter(task => task.Id !== id));
        toast.success('Task deleted successfully');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      setIsLoading(true);
      
      // Call API to update task status
      const updatedTask = await updateTaskStatus(id, newStatus);
      
      // Update state with updated task
      setTasks(prev => prev.map(task => task.Id === id ? updatedTask : task));
      
      toast.info(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'medium': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'meeting': return 'CalendarClock';
      case 'follow-up': return 'Redo';
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      default: return 'Clipboard';
    }
  };
  
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Task Management</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Organize your work and never miss a deadline
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link to="/" className="btn btn-outline flex items-center gap-1">
            <ApperIcon name="ArrowLeft" size={16} />
            Dashboard
          </Link>
          <button 
            onClick={() => setIsAddingTask(true)} 
            className="btn btn-primary flex items-center gap-1"
          >
            <ApperIcon name="Plus" size={16} />
            Add Task
          </button>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
      )}
      
      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">
              Search Tasks
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <ApperIcon name="Search" className="text-surface-500" size={16} />
              </div>
              <input
                type="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by title or description"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="statusFilter" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priorityFilter" className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1 block">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
            <thead className="bg-surface-100 dark:bg-surface-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Task</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-surface-500 dark:text-surface-400">
                    No tasks found. Add a new task to get started.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.Id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"> 
                      <button 
                        onClick={() => handleToggleStatus(task.Id, task.status)}
                        className="flex items-center justify-center"
                      >
                        {task.status === 'completed' ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                            <ApperIcon name="CheckCircle" size={18} />
                          </div>
                        ) : task.status === 'in-progress' ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <ApperIcon name="Clock" size={18} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-surface-100 dark:bg-surface-700 border-2 border-surface-300 dark:border-surface-600 flex items-center justify-center" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary-light/10 text-primary-light">
                          <ApperIcon name={getCategoryIcon(task.category)} size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-900 dark:text-white">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-surface-700 dark:text-surface-300'}`}>
                        {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate) && task.status !== 'completed' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            Overdue
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setIsEditingTask(task)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.Id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <ApperIcon name="Trash" size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Add New Task</h2>
              <TaskForm 
                onSubmit={handleAddTask} 
                onCancel={() => setIsAddingTask(false)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Task Modal */}
      <AnimatePresence>
        {isEditingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Task</h2>
              <TaskForm 
                initialData={isEditingTask} 
                onSubmit={handleUpdateTask} 
                onCancel={() => setIsEditingTask(null)} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;