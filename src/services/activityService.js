/**
 * Activity service for handling CRUD operations on activities
 * Uses the "Activity2" table from the Apper backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get recent activities
export const getRecentActivities = async (limit = 5) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        "Id", "Name", "title", "type", "description", 
        "date", "contact", "company", "Tags", "Owner",
        "CreatedOn", "ModifiedOn"
      ],
      orderBy: [{ fieldName: "date", SortType: "DESC" }],
      pagingInfo: {
        limit,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords("Activity2", params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new activity
export const createActivity = async (activityData) => {
  try {
    const apperClient = getApperClient();
    
    // Format date to ISO string if it's a Date object
    if (activityData.date instanceof Date) {
      activityData.date = activityData.date.toISOString();
    }
    
    const params = { records: [activityData] };
    const response = await apperClient.createRecord("Activity2", params);
    return response.results[0].data;
  } catch (error) {
    throw error;
  }
};

// Map activity type to icon name
export const getActivityIcon = (type) => {
  switch (type) {
    case 'call': return 'Phone';
    case 'email': return 'Mail';
    case 'meeting': return 'CalendarClock';
    case 'note': return 'FileText';
    default: return 'Activity';
  }
};

// Format relative time for activity
export const formatActivityTime = (date) => {
  const now = new Date();
  const activityDate = new Date(date);
  const diffHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffHours < 48) return 'Yesterday';
  if (diffHours < 168) return `${Math.floor(diffHours / 24)} days ago`;
  
  return activityDate.toLocaleDateString();
};