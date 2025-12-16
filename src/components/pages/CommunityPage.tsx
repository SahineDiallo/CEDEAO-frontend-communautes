import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCommunities } from '../../services/CommunityServices';
import { Communaute } from '../../models/CommunityType';
import CommunityModal from '../modals/CommunityModal'; // Importez le composant de la modal
import AddCommunityModal from '../modals/AddCommunityModel';

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const Communities = () => {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<Communaute[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCommunity, setSelectedCommunity] = useState<Communaute | null>(null); // État pour la communauté sélectionnée
  const itemsPerPage = 5;

  useEffect(() => {
    const loadCommunities = async () => {
      const data = await fetchCommunities();
      setCommunities(data);
    };
    loadCommunities();
  }, []);

  const filteredCommunities = communities.filter((community) =>
    community.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage);
  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ouvrir la modal avec les détails de la communauté
  const handleViewDetails = (community: Communaute) => {
    setSelectedCommunity(community);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setSelectedCommunity(null);
  };

  return (
    
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto"></div>
     
     <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Communities</h2>
            {/* Bouton pour ouvrir la modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-customBlue/90 transition duration-200"
      >
        Add Community
      </button>

          {/* Modal pour ajouter une communauté */}
          <AddCommunityModal isOpen={isModalOpen} onClose={closeModal} />
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Réinitialiser la pagination lors de la recherche
              }}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

      {/* Tableau */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCommunities.map((community) => (
                <tr key={community.pkId} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={community.thumbnail_image}
                      alt={community.nom}
                      className="h-10 w-10 rounded-full object-cover border border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {truncateText(community.nom, 20)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {truncateText(community.description, 50)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        onClick={() => handleViewDetails(community)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        onClick={() => navigate(`/edit-community/${community.pkId}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition duration-200"
                        onClick={() => console.log('Delete', community.pkId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {paginatedCommunities.length} of {filteredCommunities.length} communities
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal pour les détails de la communauté */}
      {selectedCommunity && (
        <CommunityModal community={selectedCommunity} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Communities;