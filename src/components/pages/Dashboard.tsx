// rgb(13,84,115)
import { useState } from 'react';
import { 
  Users, 
  Globe, 
  Settings, 
  Search, 

} from 'lucide-react';
import Communities from './CommunityPage';
import SimpleUsers from './UsersPage';
import SettingsPage from './SettingsPage';
import MembersPage from './MembersPage';
import InstitutionsPage from './InstitutionsPage';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('communities');



  return (
    <div className="min-h-screen bg-gray-100">
     {/* Header */}
    <header className="bg-white shadow">
  <div className="flex items-center justify-between px-6 py-4">
    {/* Logo */}
    <div>
      <img src="src/assets/logo_white.png" alt="Logo" className="h-10 w-auto" />
    </div>

    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <img
          src="src/assets/admin_photo.jpg"
          alt="Admin"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-gray-700">Admin</span>
      </div>
    </div>
  </div>
    </header>


      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md h-screen">
          <nav className="p-4">
            <button
              onClick={() => setSelectedTab('communities')}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                selectedTab === 'communities' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Globe className="h-5 w-5" />
              <span>Communités</span>
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                selectedTab === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </button>

            <button
              onClick={() => setSelectedTab('institutions')}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                selectedTab === 'institutions' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Insttitutions</span>
            </button>
            <button
              onClick={() => setSelectedTab('membres')}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                selectedTab === 'membres' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Membres</span>
            </button>
            <button
              onClick={() => setSelectedTab('settings')}
              className={`flex items-center space-x-2 w-full p-3 rounded-lg ${
                selectedTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
        {selectedTab === 'communities' && <Communities />}

          {selectedTab === 'users' && <SimpleUsers />}

          {selectedTab === 'settings' && <SettingsPage />}

          {selectedTab === 'membres' && <MembersPage />}

          {selectedTab === 'institutions' && <InstitutionsPage />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;