import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { countries } from 'countries-list';
import { formatIsoDate } from '../../lib/utils';

interface CommunityGroup {
  role: string;
  communities: string[];
}

interface Member {
  pkId: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  date_joined: string;
  communities: CommunityGroup[];
}

const API_URL = import.meta.env.VITE_MAIN_DOMAIN || 'http://localhost:8000/api';

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Toggle row expansion
  const toggleRow = (pkId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pkId)) {
        newSet.delete(pkId);
      } else {
        newSet.add(pkId);
      }
      return newSet;
    });
  };

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: currentPage,
          page_size: itemsPerPage,
          search: searchQuery,
          role: roleFilter
        };

        const response = await axios.get(`${API_URL}/comptes/all-members/`, { params });
        console.log("here is the response", response.data)
        setMembers(response.data.results);
        setTotalCount(response.data.count);
      } catch (err) {
        setError('Failed to load members. Please try again later.');
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchMembers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchQuery, roleFilter]);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalCount / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header and Add Member Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Members</h2>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="font-semibold">Add Member</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {['admin', 'moderator', 'member'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setRoleFilter(roleFilter === role ? null : role);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  roleFilter === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {role}s
              </button>
            ))}
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <>
                  <tr 
                    key={member.pkId} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(member.pkId)}
                  >
                    <td className="px-6 py-4">
                      {expandedRows.has(member.pkId) ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </td>
                    <td className="px-6 py-4  font-medium">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{member.email}</td>
                    <td className="px-6 py-4">{countries[member.country]?.name || member.country}</td>
                    <td className="px-6 py-4">
                      {formatIsoDate(member.date_joined)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {member.communities.map((group) => (
                          <span 
                            key={group.role}
                            className={`px-2 py-1 text-xs rounded-full ${
                              group.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : group.role === 'moderator'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {group.role} ({group.communities.length})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(member.pkId) && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {member.communities.map((group) => (
                            <div key={group.role} className="bg-white p-3 rounded shadow">
                              <h4 className="font-medium mb-2 capitalize">{group.role}</h4>
                              <div className="flex flex-wrap gap-2">
                                {group.communities.map((community) => (
                                  <span 
                                    key={community} 
                                    className="px-2 py-1 bg-gray-100 rounded text-sm"
                                  >
                                    {community}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-500">
            Showing {members.length} of {totalCount} members
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 border rounded-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
              className={`flex items-center px-4 py-2 border rounded-lg ${
                currentPage >= Math.ceil(totalCount / itemsPerPage)
                  ? 'text-gray-400 cursor-not-allowed border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;