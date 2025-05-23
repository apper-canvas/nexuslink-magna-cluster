import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import ApperIcon from './components/ApperIcon';
import Home from './pages/Home';
import Deals from './pages/Deals';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Companies from './pages/Companies';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitializationAttempted, setIsInitializationAttempted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Toggle dark mode function
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    // Update document class based on dark mode state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    // Only try to initialize once to prevent infinite loops
    if (!isInitializationAttempted) {
      setIsInitializationAttempted(true);
      
      try {
        const { ApperClient, ApperUI } = window.ApperSDK;
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Initialize but don't show login yet
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            setIsInitialized(true);
            // CRITICAL: This exact currentPath logic must be preserved in all implementations
            // DO NOT simplify or modify this pattern as it ensures proper redirection flow
            let currentPath = window.location.pathname + window.location.search;
            let redirectPath = new URLSearchParams(window.location.search).get('redirect');
            const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
                    '/callback') || currentPath.includes('/error');
            if (user) {
                // User is authenticated
                if (redirectPath) {
                    navigate(redirectPath);
                } else if (!isAuthPage) {
                    if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                        navigate(currentPath);
                    } else {
                        navigate('/');
                    }
                } else {
                    navigate('/');
                }
                // Store user information in Redux
                dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
                // User is not authenticated
                if (!isAuthPage) {
                    navigate(
                        currentPath.includes('/signup')
                         ? `/signup?redirect=${currentPath}`
                         : currentPath.includes('/login')
                         ? `/login?redirect=${currentPath}`
                         : '/login');
                } else if (redirectPath) {
                    if (
                        ![
                            'error',
                            'signup',
                            'login',
                            'callback'
                        ].some((path) => currentPath.includes(path)))
                        navigate(`/login?redirect=${redirectPath}`);
                    else {
                        navigate(currentPath);
                    }
                } else if (isAuthPage) {
                    navigate(currentPath);
                } else {
                    navigate('/login');
                }
                dispatch(clearUser());
            }
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            setIsInitialized(true); // Still set as initialized to avoid blocking the UI
          }
        });
      } catch (error) {
        console.error("Failed to initialize ApperUI:", error);
        setIsInitialized(true); // Still set as initialized to avoid blocking the UI
      }
    }
  }, []); // Empty dependency array to ensure this runs only once
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.info("You have been logged out");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed");
      }
    }
  };
  
  // Don't render app until initialization is complete
  if (!isInitialized) {
    return <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-surface-600 dark:text-surface-400">Initializing application...</p>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                <ApperIcon name="Network" size={18} />
              </div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-white">NexusLink</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <button 
                  onClick={authMethods.logout}
                  className="text-sm text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light"
                >
                  Logout
                </button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <ApperIcon name="Sun" className="h-5 w-5 text-surface-300" />
                ) : (
                  <ApperIcon name="Moon" className="h-5 w-5 text-surface-600" />
                )}
              </motion.button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Protected routes - only accessible when authenticated */}
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/companies" element={<Companies />} />
              </>
            ) : (
              <Route path="/*" element={<Login />} />
            )}
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-4 border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
          <div className="container mx-auto text-center text-sm text-surface-500 dark:text-surface-400">
            &copy; {new Date().getFullYear()} NexusLink CRM. All rights reserved.
          </div>
        </footer>
        
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;