/**
 * Task service for handling CRUD operations on tasks
 * Uses the "task" table from the Apper backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get all tasks with optional filters
export const getTasks = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        "Id", "Name", "title", "description", "dueDate", 
        "priority", "category", "status", "contact", 
        "company", "deal", "Tags", "Owner",
        "CreatedOn", "ModifiedOn"
      ],
      orderBy: [{ fieldName: "dueDate", SortType: "ASC" }]
    };

    // Add status filter if provided
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

    // Add priority filter if provided
    if (filters.priority && filters.priority !== 'all') {
      params.where = [
        ...params.where || [],
        {
          fieldName: "priority",
          operator: "ExactMatch",
          values: [filters.priority]
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
              fieldName: "title",
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

    const response = await apperClient.fetchRecords("task", params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new task
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Format date to ISO string if it's a Date object
    if (taskData.dueDate instanceof Date) {
      taskData.dueDate = taskData.dueDate.toISOString().split('T')[0];
    }
    
    const params = { records: [taskData] };
    const response = await apperClient.createRecord("task", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Update task
export const updateTask = async (id, taskData) => {
  try {
    const apperClient = getApperClient();
    
    // Format date to ISO string if it's a Date object
    if (taskData.dueDate instanceof Date) {
      taskData.dueDate = taskData.dueDate.toISOString().split('T')[0];
    }
    
    const params = { records: [{ Id: id, ...taskData }] };
    const response = await apperClient.updateRecord("task", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = { RecordIds: [id] };
    await apperClient.deleteRecord("task", params);
    return true;
  } catch (error) {
    throw error;
  }
};

// Update task status
export const updateTaskStatus = async (id, status) => {
  try {
    const apperClient = getApperClient();
    const params = { records: [{ Id: id, status }] };
    const response = await apperClient.updateRecord("task", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};