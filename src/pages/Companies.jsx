import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CompanyForm from '../components/CompanyForm';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../services/companyService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters = {
          searchTerm,
          industry: industryFilter,
          size: sizeFilter
        };
        const data = await getCompanies(filters);
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (err) {
        setError('Failed to fetch companies. Please try again later.');
        toast.error('Error loading companies');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [searchTerm, industryFilter, sizeFilter]);

  // Filter companies when search term, industry filter, or size filter changes
  useEffect(() => {
    let result = companies;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(company => 
        company?.Name?.toLowerCase().includes(term) || 
        company?.location?.toLowerCase().includes(term) ||
        company?.description?.toLowerCase().includes(term)
      );
    }
    
    if (industryFilter) {
      result = result.filter(company => company?.industry === industryFilter);
    } 
    
    if (sizeFilter) {
      result = result.filter(company => company?.size === sizeFilter);
    }
    
    setFilteredCompanies(result);
  }, [companies, searchTerm, industryFilter, sizeFilter]);

  // Extract unique industries for filter dropdown
  const uniqueIndustries = [...new Set(companies.filter(company => company?.industry).map(company => company.industry))].sort();
  
  // Extract unique sizes for filter dropdown
  const uniqueSizes = [...new Set(companies.filter(company => company?.size).map(company => company.size))].sort();

  const handleAddCompany = () => {
    setCurrentCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company) => {
    setCurrentCompany(company);
    setIsFormOpen(true);
  };

  const handleSubmitCompany = async (companyData) => {
    if (currentCompany) {
      // Update existing company - API call
      try {
        setIsLoading(true);
        
        // Prepare company data for API - Include only updateable fields
        const apiCompanyData = {
          Name: companyData.name,
          industry: companyData.industry,
          size: companyData.size,
          location: companyData.location,
          website: companyData.website,
          description: companyData.description,
        };
        
        const updatedCompany = await updateCompany(currentCompany?.Id, apiCompanyData);
        
        // Update state with new company data
        setCompanies(prevCompanies => 
          prevCompanies.map(company => company?.Id === currentCompany?.Id ? updatedCompany : company)
        );
        
        toast.success(`${companyData?.name || 'Company'} updated successfully`);
      } catch (error) {
        console.error('Error updating company:', error);
        toast.error('Failed to update company');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Add new company - API call
      try {
        setIsLoading(true);
        
        // Prepare company data for API - Include only updateable fields
        const apiCompanyData = {
          Name: companyData.name,
          industry: companyData.industry,
          size: companyData.size,
          location: companyData.location,
          website: companyData.website,
          description: companyData.description,
        };
        
        const newCompany = await createCompany(apiCompanyData);
        
        // Add new company to state
        setCompanies(prevCompanies => [...prevCompanies, newCompany]);
        
        toast.success(`${companyData?.name || 'Company'} added successfully`);
      } catch (error) {
        console.error('Error creating company:', error);
        toast.error('Failed to create company');
      } finally {
        setIsLoading(false);
      }
    }
    setIsFormOpen(false);
  };

  const handleDeleteCompany = (company) => {
    setConfirmDelete(company);
  };

  const confirmDeleteCompany = async () => {
    if (!confirmDelete) return;
    
    try {
      setIsLoading(true);
      
      // Delete company - API call
      await deleteCompany(confirmDelete?.Id);
      
      // Update state by removing the deleted company
      setCompanies(prevCompanies => prevCompanies.filter(company => company?.Id !== confirmDelete?.Id));
      
      toast.success(`${confirmDelete?.Name || 'Company'} deleted successfully`);
      
      // If the deleted company is the currently selected one, clear the selection
      if (selectedCompany && selectedCompany?.Id === confirmDelete?.Id) {
        setSelectedCompany(null);
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    } finally {
      setIsLoading(false);
      setConfirmDelete(null);
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

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
      )}

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
                        key={company?.Id}
                        className={`border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer ${selectedCompany?.Id === company?.Id ? 'bg-primary-light/10' : ''}`}
                        onClick={() => handleViewCompany(company)} 
                      >
                        <td className="py-3 px-4 font-medium">{company?.Name}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{company?.industry}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{company?.location}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{company?.size}</td>
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
                <h2 className="text-xl font-semibold text-surface-900 dark:text-white">{selectedCompany.Name}</h2>
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
                  <p className="text-surface-900 dark:text-white">{selectedCompany?.industry}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Size</h3>
                  <p className="text-surface-900 dark:text-white">{selectedCompany?.size}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Location</h3>
                  <p className="text-surface-900 dark:text-white">{selectedCompany?.location}</p>
                </div>
                
                {selectedCompany?.website && (
                  <div>
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Website</h3>
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                     >
                      {selectedCompany?.website}
                    </a>
                  </div>
                )}
                
                {selectedCompany?.description && (
                  <div>
                    <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Description</h3>
                    <p className="text-surface-900 dark:text-white">{selectedCompany?.description}</p>
                  </div>
                )}
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Associated Deals</h3>
                  {selectedCompany?.deals && selectedCompany?.deals.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCompany.deals.map(dealId => (
                        <Link
                          key={`deal-${dealId}`}
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
                  {selectedCompany?.contacts && selectedCompany?.contacts.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCompany.contacts.map(contactId => (
                        <Link 
                          key={`contact-${contactId}`}
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
              Are you sure you want to delete <span className="font-semibold">{confirmDelete?.Name || 'this company'}</span>? This action cannot be undone.
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