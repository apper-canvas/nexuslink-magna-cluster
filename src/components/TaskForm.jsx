import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';

const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'general',
    status: 'pending'
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (initialData) {
      // Format the date for the input field (YYYY-MM-DD)
      const formattedDate = initialData.dueDate ? 
        new Date(initialData.dueDate).toISOString().split('T')[0] : 
        '';
      
      setFormData({
        ...initialData,
        dueDate: formattedDate
      });
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      // Check if due date is valid
      const selectedDate = new Date(formData.dueDate);
      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = 'Invalid date format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert date string to Date object for processing
      const processedData = {
        ...formData,
        dueDate: new Date(formData.dueDate)
      };
      
      onSubmit(processedData);
      
      // Show success toast
      toast.success(initialData ? 'Task updated successfully' : 'Task created successfully');
    } else {
      toast.error('Please fix the errors in the form');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Task Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
          placeholder="Enter task title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="input-field"
          placeholder="Enter task description"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Due Date*
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`input-field ${errors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
          />
          {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input-field"
        >
          <option value="general">General</option>
          <option value="meeting">Meeting</option>
          <option value="follow-up">Follow-up</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
        <button type="submit" className="btn btn-primary flex items-center gap-2">
          <ApperIcon name={initialData ? "Save" : "Plus"} size={16} />
          {initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;