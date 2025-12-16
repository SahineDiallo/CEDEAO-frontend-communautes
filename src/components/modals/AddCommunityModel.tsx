import { useState } from 'react';
import { Communaute, Category } from '../../models/CommunityType';
import { addCommunity } from '../../services/CommunityServices';

interface AddCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCommunityModal = ({ isOpen, onClose }: AddCommunityModalProps) => {
  const [formData, setFormData] = useState<Omit<Communaute, 'pkId'>>({
    nom: '',
    description: '',
    categories: [], // Tableau d'objets Category[]
    discussions: [],
    thumbnail_image: '',
    banner_image: '',
    members: 0,
  });

  const [thumbnailImageFile, setThumbnailImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  // Liste des catégories disponibles
  const availableCategories: Category[] = [
    {
      pkId: 'a572630a-6214-4124-b90a-3996ee92835b',
      nom: 'Pauvreté',
      description: 'Situation socio-économique caractérisée par un manque de ressources financières et matérielles, limitant l\'accès aux besoins fondamentaux tels que l\'alimentation, le logement et l\'éducation.',
    },
    {
      pkId: '79b55133-d7b0-4890-8bf9-45a8f89da46a',
      nom: 'Égalité - genre',
      description: 'Principe visant à assurer une égalité de droits, de responsabilités et d\'opportunités entre les femmes et les hommes dans tous les domaines de la société.',
    },
    {
      pkId: 'cb428c7c-cb81-40ab-83ba-a09673106964',
      nom: 'Recherche économique, sociale et environnementale',
      description: 'Études et analyses portant sur les aspects économiques, sociaux et environnementaux, visant à comprendre et à améliorer les interactions entre ces domaines.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('members', formData.members.toString());
    formDataToSend.append('categories', JSON.stringify(formData.categories)); // Envoyer les catégories sous forme de JSON
    if (thumbnailImageFile) formDataToSend.append('thumbnail_image', thumbnailImageFile);
    if (bannerImageFile) formDataToSend.append('banner_image', bannerImageFile);

    try {
      const newCommunity = await addCommunity(formDataToSend);
      console.log('Community added successfully:', newCommunity);

      // Réinitialiser le formulaire après la soumission
      setFormData({
        nom: '',
        description: '',
        categories: [],
        discussions: [],
        thumbnail_image: '',
        banner_image: '',
        members: 0,
      });
      setThumbnailImageFile(null);
      setBannerImageFile(null);

      // Fermer la modal après la soumission réussie
      onClose();
    } catch (error) {
      console.error('Error adding community:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, category: Category) => {
    const isChecked = e.target.checked;
    setFormData((prev) => {
      const updatedCategories = isChecked
        ? [...prev.categories, category] // Ajouter la catégorie si cochée
        : prev.categories.filter((c) => c.pkId !== category.pkId); // Supprimer la catégorie si décochée
      return {
        ...prev,
        categories: updatedCategories,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add a Community</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition duration-200 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="nom"
                placeholder="Community Name"
                value={formData.nom}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Community Description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <div key={category.pkId} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.pkId}`}
                      checked={formData.categories.some((c) => c.pkId === category.pkId)}
                      onChange={(e) => handleCategoryChange(e, category)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category.pkId}`} className="ml-2 text-sm text-gray-700">
                      {category.nom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setThumbnailImageFile)}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setBannerImageFile)}
                className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Boutons de soumission et d'annulation */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-1/2 bg-customBlue text-white py-3 rounded-lg hover:bg-customBlue transition duration-200 transform hover:scale-105"
              >
                Add Community
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCommunityModal;