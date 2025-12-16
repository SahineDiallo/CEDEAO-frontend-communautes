
import { X, Users, MessageSquare, Calendar } from 'lucide-react';
import { Communaute } from '../../models/CommunityType';

interface CommunityModalProps {
  community: Communaute;
  onClose: () => void;
}

const CommunityModal = ({ community, onClose }: CommunityModalProps) => {
  const defaultBanner = "/api/placeholder/1200/400";
  
  const {
    nom = "Communauté",
    description = "Aucune description disponible",
    categories = [],
    discussions = [],
    banner_image,
  } = community;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
        {/* Header avec image de bannière */}
        <div className="relative h-64">
          <img
            src={banner_image || defaultBanner}
            alt={nom}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Titre et metadata */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h2 className="text-3xl font-bold text-white mb-2">{nom}</h2>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2.5k membres</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{discussions.length} discussions</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Créé le 15 Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="max-w-none">
            <p className="text-lg text-gray-700">{description}</p>
          </div>

          {/* Catégories */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span 
                    key={category.pkId}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
                  >
                    {category.nom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Discussions */}
          {discussions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Discussions récentes</h3>
              <div className="space-y-3">
                {discussions.map((discussion) => (
                  <div 
                    key={discussion.id} 
                    className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{discussion.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{discussion.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message si pas de discussions */}
          {discussions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune discussion pour le moment</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityModal;