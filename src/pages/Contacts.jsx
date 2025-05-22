import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import ContactForm from '../components/ContactForm';

// Mock data for contacts
const initialContacts = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    company: 'Acme Corp',
    title: 'Sales Manager',
    type: 'customer',
    status: 'active',
    lastContact: new Date(2023, 10, 15),
    notes: 'Met at the industry conference. Interested in our premium plan.',
    createdAt: new Date(2023, 8, 10)
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@techsolutions.com',
    phone: '(555) 987-6543',
    company: 'Tech Solutions Inc.',
    title: 'CTO',
    type: 'partner',
    status: 'active',
    lastContact: new Date(2023, 11, 3),
    notes: 'Potential integration partnership opportunity.',
    createdAt: new Date(2023, 6, 22)
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Wong',
    email: 'michael.wong@globalinc.com',
    phone: '(555) 456-7890',
    company: 'Global Inc.',
    title: 'Purchasing Director',
    type: 'lead',
    status: 'active',
    lastContact: new Date(2023, 10, 28),
    notes: 'Needs a proposal by end of quarter.',
    createdAt: new Date(2023, 9, 5)
  },
  {
    id: 4,
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@innovate.co',
    phone: '(555) 789-0123',
    company: 'Innovate Co.',
    title: 'Marketing Lead',
    type: 'customer',
    status: 'inactive',
    lastContact: new Date(2023, 9, 12),
    notes: 'Contract renewal coming up in 3 months.',
    createdAt: new Date(2023, 5, 18)
  },
  {
    id: 5,
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'robert.chen@futuretech.com',
    phone: '(555) 234-5678',
    company: 'Future Tech',
    title: 'CEO',
    type: 'lead',
    status: 'active',
    lastContact: new Date(2023, 11, 5),
    notes: 'Introduced by Sarah Johnson. Very interested in our enterprise solution.',
    createdAt: new Date(2023, 10, 1)
  }
];

const Contacts = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Apply filters and search
  useEffect(() => {
    let results = [...contacts];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(contact => 
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company?.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      results = results.filter(contact => contact.type === filterType);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      results = results.filter(contact => contact.status === filterStatus);
    }
    
    setFilteredContacts(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [contacts, searchTerm, filterType, filterStatus]);
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  
  // Handle search and filters
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterType = (e) => {
    setFilterType(e.target.value);
  };
  
  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };
  
  // Modal handlers
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  
  const openEditModal = (contact) => {
    setCurrentContact(contact);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (contact) => {
    setCurrentContact(contact);
    setIsDeleteModalOpen(true);
  };
  
  const openViewModal = (contact) => {
    setCurrentContact(contact);
    setIsViewModalOpen(true);
  };
  
  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setCurrentContact(null);
  };
  
  // CRUD operations
  const handleAddContact = (formData) => {
    const newContact = {
      ...formData,
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      createdAt: new Date(),
      lastContact: new Date()
    };
    
    setContacts([...contacts, newContact]);
    closeAllModals();
    toast.success('Contact added successfully');
  };
  
  const handleEditContact = (formData) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === currentContact.id ? { ...contact, ...formData } : contact
    );
    
    setContacts(updatedContacts);
    closeAllModals();
    toast.success('Contact updated successfully');
  };
  
  const handleDeleteContact = () => {
    const updatedContacts = contacts.filter(contact => contact.id !== currentContact.id);
    setContacts(updatedContacts);
    closeAllModals();
    toast.success('Contact deleted successfully');
  };
  
  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Contacts</h1>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={openAddModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <ApperIcon name="UserPlus" size={16} />
            Add Contact
          </button>
        </div>
      </div>
      
      {/* Filters & Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400">
                <ApperIcon name="Search" size={18} />
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterType}
              onChange={handleFilterType}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="lead">Leads</option>
              <option value="customer">Customers</option>
              <option value="partner">Partners</option>
              <option value="vendor">Vendors</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={handleFilterStatus}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Contacts Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-100 dark:bg-surface-800">
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Company</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Type</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {currentItems.length > 0 ? (
                currentItems.map(contact => (
                  <tr 
                    key={contact.id}
                    className="hover:bg-surface-50 dark:hover:bg-surface-800"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light/10 flex items-center justify-center text-primary">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                          <p className="text-sm text-surface-500 md:hidden">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{contact.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{contact.company || '-'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${contact.type === 'lead' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${contact.type === 'customer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                        ${contact.type === 'partner' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : ''}
                        ${contact.type === 'vendor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                      `}>
                        {contact.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${contact.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                        ${contact.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                      `}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(contact)}
                          className="p-1 text-surface-600 hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                          aria-label="View contact"
                        >
                          <ApperIcon name="Eye" size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(contact)}
                          className="p-1 text-surface-600 hover:text-primary rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                          aria-label="Edit contact"
                        >
                          <ApperIcon name="Edit" size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(contact)}
                          className="p-1 text-surface-600 hover:text-red-500 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                          aria-label="Delete contact"
                        >
                          <ApperIcon name="Trash2" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-surface-500">
                    {contacts.length === 0 ? (
                      <div className="flex flex-col items-center">
                        <ApperIcon name="UserX" size={48} className="text-surface-400 mb-3" />
                        <p>No contacts found. Add your first contact to get started.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ApperIcon name="Search" size={48} className="text-surface-400 mb-3" />
                        <p>No contacts match your search criteria.</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredContacts.length > itemsPerPage && (
          <div className="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 px-4 py-3">
            <div className="text-sm text-surface-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredContacts.length)} of {filteredContacts.length} contacts
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded ${currentPage === 1 ? 'text-surface-400 cursor-not-allowed' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${currentPage === totalPages ? 'text-surface-400 cursor-not-allowed' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
              >
                <ApperIcon name="ChevronRight" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Add New Contact</h2>
                  <button
                    onClick={closeAllModals}
                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <ContactForm
                  onSubmit={handleAddContact}
                  onCancel={closeAllModals}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Contact Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Edit Contact</h2>
                  <button
                    onClick={closeAllModals}
                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <ContactForm
                  contact={currentContact}
                  onSubmit={handleEditContact}
                  onCancel={closeAllModals}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Delete Contact</h2>
                  <button
                    onClick={closeAllModals}
                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-surface-600 dark:text-surface-300 mb-2">
                    Are you sure you want to delete this contact? This action cannot be undone.
                  </p>
                  <p className="font-medium">{currentContact.firstName} {currentContact.lastName}</p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeAllModals}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteContact}
                    className="btn bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* View Contact Modal */}
      <AnimatePresence>
        {isViewModalOpen && currentContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Contact Details</h2>
                  <button
                    onClick={closeAllModals}
                    className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-surface-500">Name</p>
                        <p className="font-medium">{currentContact.firstName} {currentContact.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Email</p>
                        <p className="font-medium">{currentContact.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Phone</p>
                        <p className="font-medium">{currentContact.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Type</p>
                        <p className="font-medium capitalize">{currentContact.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                          ${currentContact.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                          ${currentContact.status === 'inactive' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                        `}>
                          {currentContact.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-surface-500">Company</p>
                        <p className="font-medium">{currentContact.company || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Job Title</p>
                        <p className="font-medium">{currentContact.title || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Last Contact</p>
                        <p className="font-medium">{format(currentContact.lastContact, 'MMMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500">Added On</p>
                        <p className="font-medium">{format(currentContact.createdAt, 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                    <p>{currentContact.notes || 'No notes available'}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 border-t border-surface-200 dark:border-surface-700 pt-4">
                  <button
                    onClick={() => {
                      closeAllModals();
                      openEditModal(currentContact);
                    }}
                    className="btn btn-outline flex items-center gap-2"
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </button>
                  <button
                    onClick={closeAllModals}
                    className="btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacts;