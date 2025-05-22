import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CompanyForm from '../components/CompanyForm';

const MOCK_COMPANIES = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    size: '201-500',
    location: 'San Francisco, CA',
    website: 'https://acme.example.com',
    description: 'A leading technology company specializing in innovative solutions for enterprise customers.',
    contacts: ['2', '5'],
    deals: ['1', '3'],
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-06-22T14:45:00Z'
  },
  {
    id: '2',
    name: 'Globex Industries',
    industry: 'Manufacturing',
    size: '501+',
    location: 'Chicago, IL',
    website: 'https://globex.example.com',
    description: 'A global manufacturing leader with operations in 15 countries.',
    contacts: ['3'],
    deals: ['2'],
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-07-05T11:20:00Z'
  },
  {
    id: '3',
    name: 'Initech Software',
    industry: 'Software',
    size: '51-200',
    location: 'Austin, TX',
    website: 'https://initech.example.com',
    description: 'Enterprise software solutions for finance and accounting departments.',
    contacts: ['1', '4'],
    deals: ['4'],
    createdAt: '2023-03-05T16:45:00Z',
    updatedAt: '2023-08-18T13:10:00Z'
  },
  {
    id: '4',
    name: 'Umbrella Corp',
    industry: 'Healthcare',
    size: '201-500',
    location: 'Boston, MA',
    website: 'https://umbrella.example.com',
    description: 'Pharmaceutical research and development with a focus on innovative treatments.',
    contacts: ['6'],
    deals: [],
    createdAt: '2023-04-20T11:30:00Z',
    updatedAt: '2023-05-15T09:25:00Z'
  },
  {
    id: '5',
    name: 'Massive Dynamics',
    industry: 'Technology',
    size: '501+',
    location: 'New York, NY',
    website: 'https://massive.example.com',
    description: 'Cutting-edge technology solutions spanning multiple sectors including aerospace and defense.',
    contacts: [],
    deals: ['5'],
    createdAt: '2023-05-12T08:20:00Z',
    updatedAt: '2023-09-01T15:40:00Z'
  },
  {
    id: '6',
    name: 'Stark Industries',
    industry: 'Energy',
    size: '201-500',
    location: 'Los Angeles, CA',
    website: 'https://stark.example.com',
    description: 'Clean energy solutions and advanced engineering services.',
    contacts: ['7'],
    deals: [],
    createdAt: '2023-06-30T14:15:00Z',
    updatedAt: '2023-10-10T12:05:00Z'
  },
  {
    id: '7',
    name: 'Wayne Enterprises',
    industry: 'Conglomerate',
    size: '501+',
    location: 'Gotham City, NJ',
    website: 'https://wayne.example.com',
    description: 'A diversified multinational with interests in technology, real estate, and philanthropic ventures.',
    contacts: [],
    deals: [],
    createdAt: '2023-07-25T10:00:00Z',
    updatedAt: '2023-11-05T16:30:00Z'
  }
];

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Initialize companies from mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCompanies(MOCK_COMPANIES);
      setFilteredCompanies(MOCK_COMPANIES);
    }, 300);
  }, []);

  // Filter companies when search term, industry filter, or size filter changes
  useEffect(() => {
    let result = companies;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(company => 
        company.name.toLowerCase().includes(term) || 
        company.location.toLowerCase().includes(term) ||
        company.description.toLowerCase().includes(term)
      );
    }
    
    if (industryFilter) {
      result = result.filter(company => company.industry === industryFilter);
    }
    
    if (sizeFilter) {
      result = result.filter(company => company.size === sizeFilter);
    }
    
    setFilteredCompanies(result);
  }, [companies, searchTerm, industryFilter, sizeFilter]);

  // Extract unique industries for filter dropdown
  const uniqueIndustries = [...new Set(companies.map(company => company.industry))].sort();
  
  // Extract unique sizes for filter dropdown
  const uniqueSizes = [...new Set(companies.map(company => company.size))].sort();

  const handleAddCompany = () => {
    setCurrentCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company) => {
    setCurrentCompany(company);
    setIsFormOpen(true);
  };

  const handleSubmitCompany = (companyData) => {
    if (currentCompany) {
      // Update existing company
      const updatedCompanies = companies.map(company => 
        company.id === companyData.id ? companyData : company
      );
      setCompanies(updatedCompanies);
      toast.success(`${companyData.name} updated successfully`);
    } else {
      // Add new company
      setCompanies([...companies, companyData]);
      toast.success(`${companyData.name} added successfully`);
    }
  };

  const handleDeleteCompany = (company) => {
    setConfirmDelete(company);
  };

  const confirmDeleteCompany = () => {
    if (!confirmDelete) return;
    
    const updatedCompanies = companies.filter(company => company.id !== confirmDelete.id);
    setCompanies(updatedCompanies);
    toast.success(`${confirmDelete.name} deleted successfully`);
    setConfirmDelete(null);
    
    // If the deleted company is the currently selected one, clear the selection
    if (selectedCompany && selectedCompany.id === confirmDelete.id) {
      setSelectedCompany(null);
    }
  };

  const handleViewCompany = (company) => {
    setSelectedCompany(company);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setIndustryFilter('');
    setSizeFilter('');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Companies</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddCompany}
          className="btn btn-primary flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Company
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Companies list */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search companies..."
                    className="input-field pl-10"
                  />
                  <ApperIcon name="Search" className="absolute left-3 top-2.5 h-5 w-5 text-surface-400" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Industries</option>
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Sizes</option>
                  {uniqueSizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                
                {(searchTerm || industryFilter || sizeFilter) && (
                  <button 
                    onClick={resetFilters}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                    aria-label="Reset filters"
                  >
                    <ApperIcon name="X" className="h-5 w-5 text-surface-500" />
                  </button>
                )}
              </div>
            </div>
            
            {filteredCompanies.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Building2" className="h-12 w-12 mx-auto text-surface-300" />
                <p className="mt-2 text-surface-500 dark:text-surface-400">No companies found. Try adjusting your filters or add a new company.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700">
                      <th className="text-left py-3 px-4 font-semibold text-surface-600 dark:text-surface-300">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-600 dark:text-surface-300">Industry</th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-600 dark:text-surface-300">Location</th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-600 dark:text-surface-300">Size</th>
                      <th className="text-right py-3 px-4 font-semibold text-surface-600 dark:text-surface-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map(company => (
                      <tr 
                        key={company.id}
                        className={`border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer ${selectedCompany?.id === company.id ? 'bg-primary-light/10' : ''}`}
                        onClick={() => handleViewCompany(company)}
                      >
                        <td className="py-3 px-4 font-medium">{company.name}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{company.industry}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{company.location}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{company.size}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleEditCompany(company)}
                              className="p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                            >
                              <ApperIcon name="Edit" size={16} className="text-surface-600 dark:text-surface-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCompany(company)}
                              className="p-1.5 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                            >
                              <ApperIcon name="Trash2" size={16} className="text-surface-600 dark:text-surface-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Company details */}
        <div className="lg:col-span-1">
          {selectedCompany ? (
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">{selectedCompany.name}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditCompany(selectedCompany)}
                    className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <ApperIcon name="Edit" size={16} className="text-surface-600 dark:text-surface-400" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Industry</h3>
                  <p className="text-surface-900 dark:text-white">{selectedCompany.industry}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Size</h3>
                  <p className="text-surface-900 dark:text-white">{selectedCompany.size}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Location</h3>
                  <p className="text-surface-900 dark:text-white">{selectedCompany.location}</p>
                </div>
                
                {selectedCompany.website && (
                  <div>
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Website</h3>
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                    >
                      {selectedCompany.website}
                    </a>
                  </div>
                )}
                
                {selectedCompany.description && (
                  <div>
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Description</h3>
                    <p className="text-surface-900 dark:text-white">{selectedCompany.description}</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Associated Deals</h3>
                  {selectedCompany.deals.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCompany.deals.map(dealId => (
                        <Link 
                          key={dealId}
                          to={`/deals?id=${dealId}`}
                          className="block p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700"
                        >
                          <div className="flex items-center gap-2">
                            <ApperIcon name="BadgeDollarSign" size={16} className="text-accent" />
                            <span>Deal #{dealId}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-surface-500 dark:text-surface-400 text-sm">No deals associated with this company</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Associated Contacts</h3>
                  {selectedCompany.contacts.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCompany.contacts.map(contactId => (
                        <Link 
                          key={contactId}
                          to={`/contacts?id=${contactId}`}
                          className="block p-2 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700"
                        >
                          <div className="flex items-center gap-2">
                            <ApperIcon name="User" size={16} className="text-secondary" />
                            <span>Contact #{contactId}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-surface-500 dark:text-surface-400 text-sm">No contacts associated with this company</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <ApperIcon name="Building2" className="h-16 w-16 mx-auto text-surface-300" />
              <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No Company Selected</h3>
              <p className="mt-2 text-surface-500 dark:text-surface-400">Select a company from the list to view details</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Company Form Modal */}
      <CompanyForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitCompany}
        initialData={currentCompany}
      />
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md mx-4 p-6"
          >
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Confirm Deletion</h3>
            <p className="text-surface-700 dark:text-surface-300 mb-4">
              Are you sure you want to delete <span className="font-semibold">{confirmDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDelete(null)} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteCompany} 
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Companies;