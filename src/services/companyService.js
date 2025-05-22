/**
 * Company service for handling CRUD operations on companies
 * Uses the "company" table from the Apper backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all companies with optional filters
export const getCompanies = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        "Id", "Name", "industry", "size", "location", 
        "website", "description", "Tags", "Owner", 
        "CreatedOn", "ModifiedOn"
      ],
      orderBy: [{ fieldName: "Name", SortType: "ASC" }]
    };

    // Add search filter if provided
    if (filters.searchTerm) {
      params.whereGroups = [{
        operator: "OR",
        subGroups: [
          {
            conditions: [{
              fieldName: "Name",
              operator: "Contains",
              values: [filters.searchTerm]
            }]
          },
          {
            conditions: [{
              fieldName: "location",
              operator: "Contains",
              values: [filters.searchTerm]
            }]
          },
          {
            conditions: [{
              fieldName: "description",
              operator: "Contains",
              values: [filters.searchTerm]
            }]
          }
        ]
      }];
    }

    // Add industry filter if provided
    if (filters.industry) {
      params.where = [
        ...params.where || [],
        {
          fieldName: "industry",
          operator: "ExactMatch",
          values: [filters.industry]
        }
      ];
    }

    // Add size filter if provided
    if (filters.size) {
      params.where = [
        ...params.where || [],
        {
          fieldName: "size",
          operator: "ExactMatch",
          values: [filters.size]
        }
      ];
    }

    const response = await apperClient.fetchRecords("company", params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new company
export const createCompany = async (companyData) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [companyData] };
    const response = await apperClient.createRecord("company", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Update company
export const updateCompany = async (id, companyData) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [{ Id: id, ...companyData }] };
    const response = await apperClient.updateRecord("company", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Delete company
export const deleteCompany = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [id] };
    await apperClient.deleteRecord("company", params);
    return true;
  } catch (error) {
    throw error;
  }
};