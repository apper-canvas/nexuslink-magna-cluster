/**
 * Authentication service for handling user login, signup, and session management
 * Uses ApperUI components for authentication flows
 */

// Initialize ApperClient with project ID and public key
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Get current authenticated user
export const getCurrentUser = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI.getCurrentUser();
};

// Logout user
export const logout = async () => {
  try {
    const { ApperUI } = window.ApperSDK;
    await ApperUI.logout();
    return true;
  } catch (error) {
    throw error;
  }
};