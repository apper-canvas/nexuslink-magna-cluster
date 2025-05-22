/**
 * Contact service for handling CRUD operations on contacts
 * Uses the "contact1" table from the Apper backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all contacts with optional filters
export const getContacts = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        "Id", "Name", "firstName", "lastName", "email", "phone", 
        "title", "type", "status", "notes", "lastContact", "company",
        "Tags", "Owner", "CreatedOn", "ModifiedOn"
      ],
      orderBy: [{ fieldName: "Name", SortType: "ASC" }]
    };

    // Add where conditions if filters are provided
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
              fieldName: "email",
              operator: "Contains",
              values: [filters.searchTerm]
            }]
          }
        ]
      }];
    }

    if (filters.type && filters.type !== 'all') {
      params.where = [
        ...params.where || [],
        {
          fieldName: "type",
          operator: "ExactMatch",
          values: [filters.type]
        }
      ];
    }

    if (filters.status && filters.status !== 'all') {
      params.where = [
        ...params.where || [],
        {
          fieldName: "status",
          operator: "ExactMatch",
          values: [filters.status]
        }
      ];
    }

    if (filters.pagination) {
      params.pagingInfo = {
        limit: filters.pagination.limit || 20,
        offset: filters.pagination.offset || 0
      };
    }

    const response = await apperClient.fetchRecords("contact1", params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get contact by ID
export const getContactById = async (id) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.getRecordById("contact1", id);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new contact
export const createContact = async (contactData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [contactData]
    };
    const response = await apperClient.createRecord("contact1", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Update contact
export const updateContact = async (id, contactData) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [{ Id: id, ...contactData }] };
    const response = await apperClient.updateRecord("contact1", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Delete contact
export const deleteContact = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [id] };
    await apperClient.deleteRecord("contact1", params);
    return true;
  } catch (error) {
    throw error;
  }
};