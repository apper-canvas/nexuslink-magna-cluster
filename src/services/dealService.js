/**
 * Deal service for handling CRUD operations on deals
 * Uses the "deal1" table from the Apper backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all deals with optional filters
export const getDeals = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        "Id", "Name", "value", "stage", "date", 
        "company", "contact", "Tags", "Owner",
        "CreatedOn", "ModifiedOn"
      ],
      orderBy: [{ fieldName: "date", SortType: "ASC" }]
    };

    // Add stage filter if provided
    if (filters.stage && filters.stage !== 'all') {
      params.where = [
        ...params.where || [],
        {
          fieldName: "stage",
          operator: "ExactMatch",
          values: [filters.stage]
        }
      ];
    }

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
              fieldName: "company",
              operator: "Contains",
              values: [filters.searchTerm]
            }]
          },
          {
            conditions: [{
              fieldName: "contact",
              operator: "Contains",
              values: [filters.searchTerm]
            }]
          }
        ]
      }];
    }

    const response = await apperClient.fetchRecords("deal1", params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new deal
export const createDeal = async (dealData) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [dealData] };
    const response = await apperClient.createRecord("deal1", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Update deal
export const updateDeal = async (id, dealData) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [{ Id: id, ...dealData }] };
    const response = await apperClient.updateRecord("deal1", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Update deal stage
export const updateDealStage = async (id, stage) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [{ Id: id, stage }] };
    const response = await apperClient.updateRecord("deal1", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Delete deal
export const deleteDeal = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [id] };
    await apperClient.deleteRecord("deal1", params);
    return true;
  } catch (error) {
    throw error;
  }
};