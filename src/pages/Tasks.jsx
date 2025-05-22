import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import TaskForm from '../components/TaskForm';

// Sample task data
const initialTasks = [
  {
    id: 1,
    title: 'Follow up with Acme Corp',
    description: 'Send product brochure and pricing information',
    dueDate: new Date('2023-11-15'),
    priority: 'high',
    category: 'follow-up',
    status: 'completed',
    createdAt: new Date('2023-11-10')
  },
  {
    id: 2,
    title: 'Prepare client presentation',
    description: 'Create slides for the quarterly business review',
    dueDate: new Date('2023-11-20'),
    priority: 'urgent',
    category: 'meeting',
    status: 'in-progress',
    createdAt: new Date('2023-11-12')
  },
  {
    id: 3,
    title: 'Call John regarding contract',
    description: 'Discuss the terms of the new service agreement',
    dueDate: new Date('2023-11-18'),
    priority: 'medium',
    category: 'call',
    status: 'pending',
    createdAt: new Date('2023-11-11')
  },
  {
    id: 4,
    title: 'Send proposal to Tech Solutions',
    description: 'Finalize and send the project proposal',
    dueDate: new Date('2023-11-25'),
    priority: 'medium',
    category: 'email',
    status: 'pending',
    createdAt: new Date('2023-11-14')
  },
  {
    id: 5,
    title: 'Review marketing campaign results',
    description: 'Analyze the performance metrics from the latest campaign',
    dueDate: new Date('2023-11-30'),
    priority: 'low',
    category: 'general',
    status: 'pending',
    createdAt: new Date('2023-11-15')
  }
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Initialize with sample data
  useEffect(() => {
    // In a real app, you would fetch from an API
    const today = new Date();
    
    // Add current date tasks for demo
    const updatedTasks = [
      ...initialTasks,
      {
        id: 6,
        title: 'Complete project documentation',
        description: 'Finalize all technical documentation for the client',
        dueDate: new Date(today),
        priority: 'high',
        category: 'general',
        status: 'in-progress',
        createdAt: new Date(today.setDate(today.getDate() - 1))
      },
      {
        id: 7,
        title: 'Schedule team meeting',
        description: 'Coordinate with team members for weekly sync',
        dueDate: new Date(today.setDate(today.getDate() + 2)),
        priority: 'medium',
        category: 'meeting',
        status: 'pending',
        createdAt: new Date(today)
      }
    ];
    
    setTasks(updatedTasks);
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
  
  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Math.max(...tasks.map(t => t.id), 0) + 1,
      createdAt: new Date()
    };
    
    setTasks(prev => [...prev, newTask]);
    setIsAddingTask(false);
  };
  
  const handleUpdateTask = (taskData) => {
    setTasks(prev => prev.map(task => 
      task.id === taskData.id ? { ...task, ...taskData } : task
    ));
    setIsEditingTask(null);
  };
  
  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    }
  };
  
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    
    toast.info(`Task marked as ${newStatus}`);
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
                  <tr key={task.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleStatus(task.id, task.status)}
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
                        onClick={() => handleDeleteTask(task.id)}
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