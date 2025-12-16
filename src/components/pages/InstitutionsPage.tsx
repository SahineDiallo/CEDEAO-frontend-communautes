import { useState } from 'react';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// Données de démonstration pour les institutions
const sampleInstitutions = [
  {
    id: 1,
    nom: 'Université de Paris',
    site_web: 'https://www.univ-paris.fr',
    email: 'contact@univ-paris.fr',
    telephone: '+33 1 44 27 10 00',
    adresse: '12 Rue de l\'Université, 75007 Paris, France',
  },
  {
    id: 2,
    nom: 'MIT',
    site_web: 'https://www.mit.edu',
    email: 'admissions@mit.edu',
    telephone: '+1 617-253-1000',
    adresse: '77 Massachusetts Ave, Cambridge, MA 02139, USA',
  },
  {
    id: 3,
    nom: 'Stanford University',
    site_web: 'https://www.stanford.edu',
    email: 'admissions@stanford.edu',
    telephone: '+1 650-723-2300',
    adresse: '450 Serra Mall, Stanford, CA 94305, USA',
  },
  {
    id: 4,
    nom: 'University of Oxford',
    site_web: 'https://www.ox.ac.uk',
    email: 'admissions@ox.ac.uk',
    telephone: '+44 1865 270000',
    adresse: 'Oxford OX1 2JD, United Kingdom',
  },
  {
    id: 5,
    nom: 'ETH Zurich',
    site_web: 'https://www.ethz.ch',
    email: 'info@ethz.ch',
    telephone: '+41 44 632 11 11',
    adresse: 'Rämistrasse 101, 8092 Zürich, Switzerland',
  },
  {
    id: 6,
    nom: 'University of Tokyo',
    site_web: 'https://www.u-tokyo.ac.jp',
    email: 'info@u-tokyo.ac.jp',
    telephone: '+81 3-3812-2111',
    adresse: '7 Chome-3-1 Hongo, Bunkyo City, Tokyo 113-8654, Japan',
  },
];

const InstitutionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrer les institutions en fonction de la recherche
  const filteredInstitutions = sampleInstitutions.filter(
    (institution) =>
      institution.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.adresse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const paginatedInstitutions = filteredInstitutions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion des changements de page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Institutions</h2>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-customBlue text-white rounded-lg hover:bg-customBlue/90 transition duration-200"
          >
            <Plus className="h-4 w-4" />
            <span className="font-semibold">Add Institution</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search institutions..."
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInstitutions.map((institution) => (
                <tr key={institution.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {institution.nom}
                  </td>
               
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {institution.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {institution.telephone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {institution.adresse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 transition duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition duration-200">
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
            Showing {paginatedInstitutions.length} of {filteredInstitutions.length} institutions
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousPage}
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
              onClick={handleNextPage}
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
    </div>
  );
};

export default InstitutionsPage;