import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface FichierFormProps {
  onClose: () => void; // Callback to close the form
  discussionId?: string; // Optional discussion ID to associate the file
  communauteId?: string; // Optional communaute ID to associate the file
}

interface Errors {
  nom?: string; // Error message for the name field
  fichier?: string; // Error message for the file field
  backend?: string; // Error message for backend errors
}

const FichierForm: React.FC<FichierFormProps> = ({ onClose, communauteId }) => {
  const [nom, setNom] = useState<string>('');
  const [fichier, setFichier] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const domain = import.meta.env.VITE_MAIN_DOMAIN
  

  // Validate the form
  const validateForm = () => {
    const newErrors: Errors = {};
    if (!nom) newErrors.nom = 'Un nom est requis';
    if (!fichier) newErrors.fichier = 'Un fichier est requis';
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails

    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Append form data
    formData.append('nom', nom);
    if (fichier) formData.append('fichier', fichier);
    if (communauteId) formData.append('communaute_id', communauteId);

    try {
      // Send data to the backend
      const response = await fetch(`${domain}/api/fichiers/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Use FormData for file uploads
      });

      if (!response.ok) {
        // Handle backend errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file.');
      }

      const data = await response.json(); // Parse the JSON response
      toast.success('Fichier uploadé avec succès !');
      onClose(); // Close the form
      console.log('File uploaded:', data);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Display error message to the user
      if (error instanceof Error) {
        setErrors({
          ...errors,
          backend: error.message || 'Failed to upload file. Please try again.',
        });
      } else {
        setErrors({
          ...errors,
          backend: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom Field */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du fichier
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={nom}
          onChange={(e) => {
            setNom(e.target.value);
            setErrors({ ...errors, nom: '' }); // Clear errors when typing
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
      </div>

      {/* Fichier Field */}
      <div>
        <label htmlFor="fichier" className="block text-sm font-medium text-gray-700 mb-1">
          Fichier
        </label>
        <input
          type="file"
          id="fichier"
          name="fichier"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFichier(e.target.files[0]);
              setErrors({ ...errors, fichier: '' }); // Clear errors when a file is selected
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        {errors.fichier && <p className="text-red-500 text-sm mt-1">{errors.fichier}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Uploader
        </button>
      </div>

      {/* Backend Error Message */}
      {errors.backend && <p className="text-red-500 text-sm mt-2">{errors.backend}</p>}
    </form>
  );
};

export default FichierForm;