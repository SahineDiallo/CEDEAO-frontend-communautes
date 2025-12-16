import { Communaute } from '../../models/CommunityType';

interface CommunityModalProps {
  community: Communaute;
  onClose: () => void;
}

const CommunityModal = ({ community, onClose }: CommunityModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all duration-300 ease-in-out animate-fade-in">
        {/* En-tête de la modal */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{community.nom}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition duration-200 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Contenu de la modal */}
        <div className="p-6">
          {/* Bannière */}
          <img
            src={community.banner_image}
            alt={community.nom}
            className="w-full h-48 object-cover rounded-lg mb-6 shadow-md"
          />

          {/* Description */}
          <p className="text-gray-700 text-lg mb-6">{community.description}</p>

          {/* Catégories */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Catégories</h3>
            <div className="flex flex-wrap gap-2">
              {community.categories.map((category) => (
                <span
                  key={category.pkId}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {category.nom}
                </span>
              ))}
            </div>
          </div>

          {/* Discussions */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Discussions</h3>
            <ul className="space-y-2">
              {community.discussions.map((discussion) => (
                <li key={discussion.id} className="text-gray-600">
                  <span className="font-medium">{discussion.title}</span> - {discussion.content}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pied de la modal */}
        <div className="bg-gray-50 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-md"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityModal;