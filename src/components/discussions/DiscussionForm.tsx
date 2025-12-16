import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { InputWithIcon } from '../ui/InputWithIcon';
import RichTextEditor, { Upload } from '../ui/RichTextEditor';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import UploadProgress from '../ui/UploadProgress';

interface DiscussionFormProps {
  onClose: (new_obj?: { new_obj: boolean }) => void;
  tempFiles: string[];
  onTempFileUpload?: (tempFilePath: string) => void;
  resetFiles: () => void;
}

interface Errors {
  titre?: string;
  contenu?: string;
  backend?: string;
  headlineDescription?: string;
}

const DiscussionForm: React.FC<DiscussionFormProps> = ({
  onClose,
  onTempFileUpload,
  tempFiles,
  resetFiles
}) => {
  const [formData, setFormData] = useState({
    titre: '',
    headlineDescription: "",
    contenu: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [uploads, setUploads] = useState<Upload[]>([]);
  const { pkId } = useParams<{ pkId: string }>();
  const domain = import.meta.env.VITE_MAIN_DOMAIN;

  const validateForm = () => {
    const newErrors: {titre?: string, contenu?: string, headlineDescription?: string}  = {};
    if (!formData.titre) newErrors.titre = 'Un titre est requis';
    if (!formData.contenu) newErrors.contenu = 'Contenu est un champs requis';
    if (!formData.headlineDescription) newErrors.headlineDescription = 'Résumé est un champs requis';
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when the user starts typing
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      contenu: content,
    });
    // Clear errors when the user starts typing
    setErrors({
      ...errors,
      contenu: '',
    });
  };

  const handleEditorDescChange = (content: string) => {
    setFormData({
      ...formData,
      headlineDescription: content,
    });
    // Clear errors when the user starts typing
    setErrors({
      ...errors,
      headlineDescription: '',
    });
  };

  const handleUploadsChange = (newUploads: Upload[]) => {
    setUploads(newUploads);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Check if there are ongoing uploads
    if (uploads.length > 0) {
      toast.warning('Veuillez attendre la fin des téléchargements en cours');
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${domain}/api/discussions/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre: formData.titre,
          contenu: formData.contenu,
          communaute: pkId,
          fichierIds: tempFiles,
          headlineDescription: formData.headlineDescription
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create discussion.');
      }
  
      // const data = await response.json();
      toast.success('Discussion créée avec succès !');
      resetFiles();
      onClose({new_obj: true});
    } catch (error) {
      console.error('Error creating discussion:', error);
      if (error instanceof Error) {
        setErrors({
          ...errors,
          backend: error.message || 'Failed to create discussion. Please try again.',
        });
      } else {
        setErrors({
          ...errors,
          backend: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  // Fonction pour gérer la fermeture du formulaire
  const handleCloseForm = () => {
    // Vérifier s'il y a des uploads en cours
    if (uploads.length > 0) {
      if (window.confirm('Des téléchargements sont en cours. Êtes-vous sûr de vouloir annuler?')) {
        resetFiles();
        onClose();
      }
    } else {
      resetFiles();
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      {/* Fixed upload progress bar at the top */}
      {uploads.length > 0 && (
        <div className="sticky top-0 bg-white p-4 shadow-md z-10 border-b">
          {uploads.map((upload) => (
            <div key={upload.id} className="mb-2">
              <UploadProgress value={upload.progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {upload.progress}% completed - {upload.fileName}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre Field */}
        <InputWithIcon
          icon={<MessageSquare className="h-5 w-5 text-gray-400" />}
          label="Titre"
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          required
        />
        
        {/* Headline Description Field */}
        <div>
          <label htmlFor="headlineDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Résumé de la discussion
          </label>
          <RichTextEditor
            content={formData.headlineDescription}
            onChange={handleEditorDescChange}
            onTempFileUpload={onTempFileUpload}
            textOnly={true}
            onUploadsChange={handleUploadsChange}
          />
          {errors.headlineDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.headlineDescription}</p>
          )}
        </div>
        
        {/* Contenu Field */}
        <div>
          <label htmlFor="contenu" className="block text-sm font-medium text-gray-700 mb-1">
            Contenu
          </label>
          <RichTextEditor
            content={formData.contenu}
            onChange={handleEditorChange}
            onTempFileUpload={onTempFileUpload}
            onUploadsChange={handleUploadsChange}
          />
          {errors.contenu && <p className="text-red-500 text-sm mt-1">{errors.contenu}</p>}
        </div>

        {/* Backend Error Display */}
        {errors.backend && (
          <div className="bg-red-50 p-4 rounded">
            <p className="text-red-500">{errors.backend}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCloseForm}
            className="inline-flex justify-center rounded-0 border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-0 border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={uploads.length > 0}
          >
            Ajouter discussion
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscussionForm;