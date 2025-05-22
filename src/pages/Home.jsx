import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    toast.info(`Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)} view`);
  };

  // Dashboard overview stats
  const stats = [
    { 
      id: 1, 
      title: 'Total Contacts', 
      value: 342, 
      icon: 'Users', 
      change: '+12%', 
      color: 'bg-blue-500' 
    },
    { 
      id: 2, 
      title: 'Active Deals', 
      value: 28, 
      icon: 'LineChart', 
      change: '+5%', 
      color: 'bg-green-500' 
    },
    { 
      id: 3, 
      title: 'Tasks Due', 
      value: 17, 
      icon: 'CheckSquare', 
      change: '-3%', 
      color: 'bg-yellow-500' 
    },
    { 
      id: 4, 
      title: 'Revenue', 
      value: '$86,240', 
      icon: 'DollarSign', 
      change: '+18%', 
      color: 'bg-purple-500' 
    },
  ];

  // Activities list for dashboard
  const recentActivities = [
    { 
      id: 1,
      type: 'call', 
      title: 'Call with John Smith', 
      time: '2 hours ago',
      contact: 'John Smith',
      icon: 'Phone'
    },
    { 
      id: 2, 
      type: 'email', 
      title: 'Email to Sarah Johnson', 
      time: '4 hours ago',
      contact: 'Sarah Johnson',
      icon: 'Mail' 
    },
    { 
      id: 3, 
      type: 'meeting', 
      title: 'Meeting with Acme Corp', 
      time: 'Yesterday',
      contact: 'Acme Corp',
      icon: 'CalendarClock' 
    },
    { 
      id: 4, 
      type: 'note', 
      title: 'Added follow-up note', 
      time: '2 days ago',
      contact: 'Tech Solutions Inc.',
      icon: 'FileText' 
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Navigation Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 border-b border-surface-200 dark:border-surface-700 pb-2">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`btn ${
              activeTab === 'dashboard'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('contacts')}
            className={`btn ${
              activeTab === 'contacts'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="Users" size={16} />
              <span className="hidden sm:inline">Contacts</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('deals')}
            className={`btn ${
              activeTab === 'deals'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="BarChart2" size={16} />
              <span className="hidden sm:inline">Deals</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('tasks')}
            className={`btn ${
              activeTab === 'tasks'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="CheckCircle" size={16} />
              <span className="hidden sm:inline">Tasks</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('reports')}
            className={`btn ${
              activeTab === 'reports'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="PieChart" size={16} />
              <span className="hidden sm:inline">Reports</span>
            </span>
          </button>
          
          <button
            onClick={() => handleTabChange('companies')}
            className={`btn ${
              activeTab === 'companies'
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="Building2" size={16} />
              <span className="hidden sm:inline">Companies</span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: stat.id * 0.1 }}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-surface-500 dark:text-surface-400 text-sm">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                      <ApperIcon name={stat.icon} size={20} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Side - Main Feature */}
              <div className="lg:col-span-2">
                <MainFeature />
              </div>
              
              {/* Right Side - Recent Activities */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Activities</h2>
                  <button className="text-primary text-sm hover:underline">View All</button>
                </div>
                
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-primary-light/10 text-primary-light">
                        <ApperIcon name={activity.icon} size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-surface-900 dark:text-surface-100">{activity.title}</p>
                        <p className="text-sm text-surface-500">{activity.contact}</p>
                        <p className="text-xs text-surface-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="btn btn-outline w-full mt-4 flex items-center justify-center gap-2">
                  <ApperIcon name="Plus" size={16} />
                  Add New Activity
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Contacts</h1>
              <Link 
                to="/contacts" 
                className="btn btn-primary"
              >
                Go to Contacts
              </Link>
            </div>
            <div className="card p-6">
              <p className="text-surface-500 mb-4">Manage your contacts, leads, and customers all in one place. Click the button above to access the full contacts management module.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'deals' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Deals Pipeline</h1>
              <Link 
                to="/deals" 
                className="btn btn-primary"
              >
                Go to Deals
              </Link>
            </div>
            <p className="text-surface-500">Track your sales pipeline, manage opportunities, and monitor deal progress from lead to close. Click the button above to access the full deals management module.</p>
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Tasks & Reminders</h1>
              <Link 
                to="/tasks" 
                className="btn btn-primary"
              >
                Go to Tasks
              </Link>
            </div>
            <p className="text-surface-500">Organize your work, set deadlines, and never miss important follow-ups. 
            Click the button above to access the full task management module.</p>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="card p-6">
            <h1 className="text-2xl font-bold mb-6">Reports & Analytics</h1>
            <p className="text-surface-500">Reports module will be available in the next update.</p>
          </div>
        )}
        
        {activeTab === 'companies' && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Company Directory</h1>
              <Link 
                to="/companies" 
                className="btn btn-primary"
              >
                Go to Companies
              </Link>
            </div>
            <p className="text-surface-500">Manage company profiles, track associated contacts, and organize
            deals by organization. Click the button above to access the full company management module.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;