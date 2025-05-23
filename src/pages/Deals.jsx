import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { getDeals, createDeal, updateDeal, updateDealStage, deleteDeal } from '../services/dealService';

const Deals = () => {
  // Deal stages for kanban board
  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-500', icon: 'UserPlus' },
    { id: 'qualified', name: 'Qualified', color: 'bg-indigo-500', icon: 'CheckCircle' },
    { id: 'proposal', name: 'Proposal', color: 'bg-purple-500', icon: 'FileText' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-yellow-500', icon: 'MessageSquare' },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-500', icon: 'Award' }
  ];

  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewDealForm, setShowNewDealForm] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state for new deal
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    stage: 'lead',
    contact: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch deals from API
  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters = {
          searchTerm,
          stage: currentFilter !== 'all' ? currentFilter : undefined
        };
        const data = await getDeals(filters);
        setDeals(data);
      } catch (err) {
        setError('Failed to fetch deals. Please try again later.');
        toast.error('Error loading deals');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, [searchTerm, currentFilter]);
  
  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission for new deal with API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.company || !formData.value) {
      toast.error('Please fill in all required fields');
      return;
    } 

    try {
      setIsLoading(true);
      
      // Prepare deal data for API
      const dealData = {
        Name: formData.name,
        company: formData.company,
        value: formData.value,
        stage: formData.stage,
        contact: formData.contact,
        date: formData.date
      };
      
      // Call API to create new deal
      const newDeal = await createDeal(dealData);
      
      // Update state with new deal
      setDeals([...deals, newDeal]);
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        value: '',
        stage: 'lead',
        contact: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      setShowNewDealForm(false);
      toast.success('New deal has been created!');
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create new deal');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle deal stage update with API
  const handleDrop = async (stageId) => {
    if (draggedDeal && draggedDeal.stage !== stageId) {
      try {
        setIsLoading(true);
        
        // Call API to update deal stage
        const updatedDeal = await updateDealStage(draggedDeal.Id, stageId);
        
        // Update state with updated deal
        const updatedDeals = deals.map(deal => 
          deal.Id === draggedDeal.Id ? updatedDeal : deal
        );
        
        setDeals(updatedDeals);
        toast.info(`"${draggedDeal?.Name || 'Deal'}" moved to ${stages.find(s => s.id === stageId)?.name || stageId}`);
      } catch (error) {
        console.error('Error updating deal stage:', error);
        toast.error('Failed to update deal stage');
      } finally {
        setIsLoading(false);
      }
    }
    
    setDraggedDeal(null);
  };
  
  // Handle drag start
  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };
  
  // Handle deal deletion
  const handleDeleteDeal = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        setIsLoading(true);
        
        // Call API to delete deal
        await deleteDeal(id);
        
        // Update state by removing the deleted deal
        const updatedDeals = deals.filter(deal => deal.Id !== id);
        setDeals(updatedDeals);
        
        toast.success('Deal deleted successfully');
      } catch (error) {
        console.error('Error deleting deal:', error);
        toast.error('Failed to delete deal');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Filter deals based on current filter and search term
  const filteredDeals = deals.filter(deal => {
    const matchesFilter = currentFilter === 'all' || deal.stage === currentFilter;
    const matchesSearch =
      searchTerm === '' || 
      deal?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal?.contact?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Group deals by stage
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredDeals.filter(deal => deal?.stage === stage.id);
    return acc;
  }, {});

  // Calculate total deal value
  const totalDealValue = deals.reduce((sum, deal) => {
    const value = parseFloat(deal?.value?.replace(/[^0-9.-]+/g, "") || 0);
    return isNaN(value) ? sum : sum + value;
  }, 0);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Deals Pipeline</h1>
        <p className="text-surface-500 dark:text-surface-400">
          Manage your sales pipeline and track deal progress
        </p>
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-surface-500 dark:text-surface-400 text-sm">Total Deals</p>
          <h3 className="text-2xl font-bold mt-1">{deals.length}</h3>
        </div>
        <div className="card p-4">
          <p className="text-surface-500 dark:text-surface-400 text-sm">Active Deals</p>
          <h3 className="text-2xl font-bold mt-1">{deals.filter(d => d?.stage !== 'closed').length}</h3>
        </div>
        <div className="card p-4">
          <p className="text-surface-500 dark:text-surface-400 text-sm">Total Value</p>
          <h3 className="text-2xl font-bold mt-1">${totalDealValue.toLocaleString()}</h3>
        </div>
      </div>
      
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4">
          <h2 className="text-xl font-semibold">Deal Pipeline</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ApperIcon name="Search" className="h-4 w-4 text-surface-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter dropdown */}
            <select 
              className="input-field"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
            
            {/* Add new deal button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary whitespace-nowrap"
              onClick={() => setShowNewDealForm(true)}
            >
              <span className="flex items-center gap-2">
                <ApperIcon name="Plus" size={16} />
                New Deal
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Kanban board */}
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[800px] px-4 pb-4">
            {stages.map((stage) => (
              <div 
                key={stage.id}
                className="bg-surface-100 dark:bg-surface-800 rounded-lg p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(stage.id)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`${stage.color} w-3 h-3 rounded-full`}></div>
                  <h3 className="font-medium text-sm">{stage.name}</h3>
                  <div className="bg-surface-200 dark:bg-surface-700 text-xs rounded-full px-2 py-0.5 ml-auto">
                    {dealsByStage[stage.id]?.length || 0}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {dealsByStage[stage.id]?.map((deal) => (
                    <motion.div
                      key={deal.Id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                      className="bg-white dark:bg-surface-700 p-3 rounded-lg shadow-soft cursor-grab"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm line-clamp-1">{deal.Name}</h4>
                        <div className="dropdown relative ml-2">
                          <button className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-600">
                            <ApperIcon name="MoreVertical" size={14} className="text-surface-500" />
                          </button>
                          <div 
                            className="hidden absolute right-0 mt-1 py-1 w-36 bg-white dark:bg-surface-700 shadow-lg rounded-lg z-10"
                            onClick={() => handleDeleteDeal(deal.Id)}
                          >
                            <button className="w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-surface-100 dark:hover:bg-surface-600 flex items-center gap-2">
                              <ApperIcon name="Trash2" size={14} />
                              Delete 
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-surface-500 mb-2">
                        {deal.company}
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-primary-dark">
                          {deal?.value || '$0'}
                        </div>
                        <div className="text-xs text-surface-500">
                          {deal?.date ? new Date(deal.date).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-surface-500">
                        <ApperIcon name="User" size={12} className="mr-1" />
                        {deal.contact}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* New Deal Modal */}
      <AnimatePresence>
        {showNewDealForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Deal</h3>
                <button 
                  onClick={() => setShowNewDealForm(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <ApperIcon name="X" size={18} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Deal Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g. Software Implementation"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g. Acme Corp"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Value *</label>
                      <input
                        type="text"
                        name="value"
                        value={formData.value}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g. $10,000"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Stage</label>
                      <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {stages.map(stage => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Person</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g. John Smith"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Expected Close Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewDealForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Deal
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deals;