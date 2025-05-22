import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const CompanyForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) => {
  const defaultFormData = {
    id: crypto.randomUUID(),
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: '',
    contacts: [],
    deals: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [initialData, isOpen]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }
    
    if (!formData.size.trim()) {
      newErrors.size = "Company size is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (formData.website && !/^(http|https):\/\/[^ "]+$/.test(formData.website)) {
      newErrors.website = "Please enter a valid URL (including http:// or https://)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const updatedData = {
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    onSubmit(updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-lg mx-4"
      >
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
            {initialData ? 'Edit Company' : 'Add New Company'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
          >
            <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">Company Name*</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input-field" />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="industry" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">Industry*</label>
              <input type="text" id="industry" name="industry" value={formData.industry} onChange={handleChange} className="input-field" />
              {errors.industry && <p className="mt-1 text-sm text-red-500">{errors.industry}</p>}
            </div>
            
            <div>
              <label htmlFor="size" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">Company Size*</label>
              <input type="text" id="size" name="size" value={formData.size} onChange={handleChange} className="input-field" placeholder="e.g., 1-10, 11-50, 51-200, 201-500, 500+" />
              {errors.size && <p className="mt-1 text-sm text-red-500">{errors.size}</p>}
            </div>
            
            <div>
              <label htmlFor="location" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">Location*</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="input-field" />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="website" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">Website</label>
              <input type="text" id="website" name="website" value={formData.website} onChange={handleChange} className="input-field" placeholder="https://example.com" />
              {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="input-field"></textarea>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update Company' : 'Add Company'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CompanyForm;