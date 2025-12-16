import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Member } from '../../types';
import { useAppSelector } from '../../hooks/useAppSelector';
import { RootState } from '../../store/store';

interface WarningCategory {
  id: string;
  name: string;
  description: string;
  reasons: WarningReason[];
}

interface WarningReason {
  id: string;
  title: string;
  description: string;
  default_duration_days: number;
  requires_image: boolean;
}


interface IssueWarningFormProps {
  member: Member & {
    shouldSuspend?: boolean;  // Add this to extend the Member type
  };
  onClose: () => void;
}

const IssueWarningForm = ({ member, onClose }: IssueWarningFormProps) => {
    const [categories, setCategories] = useState<WarningCategory[]>([]);
    const [step, setStep] = useState<'category' | 'reason' | 'confirm'>('category');
    const [isLoading, setIsLoading] = useState(false);
    const communityDetails = useAppSelector((state: RootState) => state.communityDetails.data)
    const communityPkId = communityDetails?.pkId

    // Zod schema for form validation
    const warningFormSchema = z.object({
    categoryId: z.string().min(1, "Veuillez sélectionner une catégorie"),
    reasonId: z.string().min(1, "Veuillez sélectionner un motif"),
    notes: z.string().optional(),
    image: z.custom<File | undefined>((val) => val instanceof File || val === undefined, {
        message: "Veuillez fournir un fichier valide"
    })
    }).superRefine((data, ctx) => {
    // Find the selected reason to check if image is required
    const selectedCategory = categories.find(cat => cat.id === data.categoryId);
    const selectedReason = selectedCategory?.reasons.find(reason => reason.id === data.reasonId);

    if (selectedReason?.requires_image && !data.image) {
        ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Une image est requise pour ce motif",
        path: ["image"]
        });
    }
    });

    type WarningFormValues = z.infer<typeof warningFormSchema>;

    const { 
        register, 
        handleSubmit, 
        watch, 
        setValue,
        formState: { errors },
        trigger
    } = useForm<WarningFormValues>({
        resolver: zodResolver(warningFormSchema)
    });

    const selectedCategoryId = watch('categoryId');
    const selectedReasonId = watch('reasonId');
    // const selectedImage = watch('image');
    const domain = import.meta.env.VITE_MAIN_DOMAIN
    const  token  = useAppSelector((state: RootState) => state.auth.token);

    // Fetch categories and reasons
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get<WarningCategory[]>(
                `${domain}/api/get_warning_categories/`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
                );
            console.log("responsde cate", response.data)
            setCategories(response.data);
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) 
            ? error.response?.data?.error 
            : "Impossible de charger les catégories d'avertissement";
            toast.error(errorMessage);
        }
        };
        
        fetchData();
    }, [domain, token]);


  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedReason = selectedCategory?.reasons.find(r => r.id === selectedReasonId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setValue('image', e.target.files[0]);
      trigger('image');
    }
  };

  const onSubmit = async (data: WarningFormValues) => {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('member_id', member.user.pkId);
    formData.append('reason_id', data.reasonId);
    formData.append('notes', data.notes || '');
    formData.append('community_id', communityPkId || '')
    if (member.shouldSuspend) {
        formData.append('suspension', `${member.shouldSuspend}`);
    }
    
    // Only append image if it exists
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      const response = await axios.post(`${domain}/api/create-warning/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.status);
      onClose();
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error
        : "Erreur lors de la création de l'avertissement";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = async (e: React.MouseEvent) => {
    e.preventDefault(); // ⛔ stops form auto-submit
    e.stopPropagation();

    let isValid = false;

    if (step === 'category') {
      isValid = await trigger('categoryId');
    } else if (step === 'reason') {
      isValid = await trigger(['reasonId', 'image']);
    }

    if (isValid) {
      if (step === 'category') setStep('reason');
      else if (step === 'reason') setStep('confirm');
    }
};

    console.log("user", member)
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md w-full">
      <h3 className="text-lg font-medium mb-4">
        Avertissement pour {member.user?.full_name}
      </h3>
      
      <div className="mb-4 flex gap-2">
        <div className={`flex-1 h-1 rounded-full ${
          step === 'category' ? 'bg-orange-500' : 'bg-gray-200'
        }`}></div>
        <div className={`flex-1 h-1 rounded-full ${
          step === 'reason' ? 'bg-orange-500' : 'bg-gray-200'
        }`}></div>
        <div className={`flex-1 h-1 rounded-full ${
          step === 'confirm' ? 'bg-orange-500' : 'bg-gray-200'
        }`}></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 'category' && (
            <div>
                <h4 className="font-medium mb-3">1. Choisissez une catégorie</h4>
                <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                    <button
                    key={category.id}
                    type="button"
                    className={`px-4 py-2 rounded-full border ${
                        selectedCategoryId === category.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                        if (selectedCategoryId === category.id) {
                        setValue('categoryId', '');
                        } else {
                        setValue('categoryId', category.id);
                        setValue('reasonId', '');
                        }
                    }}
                    >
                    {category.name}
                    {selectedCategoryId === category.id && (
                        <span className="ml-2">×</span>
                    )}
                    </button>
                ))}
                </div>
                {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
            </div>
        )}

        {step === 'reason' && selectedCategory && (
        <div>
            <h4 className="font-medium mb-3">2. Sélectionnez un motif</h4>
            <div className="space-y-4">
            <select
                {...register('reasonId')}
                className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
            >
                <option value="">Sélectionnez un motif</option>
                {selectedCategory.reasons.map((reason) => (
                <option key={reason.id} value={reason.id}>
                    {reason.title} ({reason.default_duration_days} jours)
                </option>
                ))}
            </select>
            {errors.reasonId && (
                <p className="mt-1 text-sm text-red-600">{errors.reasonId.message}</p>
            )}

            {selectedReason && (
                <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{selectedReason.description}</p>
                </div>
            )}

            {selectedReason?.requires_image && (
                <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                    Preuve image *
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                />
                {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                )}
                </div>
            )}

            <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                    Notes supplémentaires
                </label>
                <textarea
                {...register('notes')}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Détails sur l'incident..."
                />
            </div>
            </div>
        </div>
        )}

        <div className="flex justify-between mt-6">
            {step !== 'category' ? (
            <button
                type="button"
                onClick={() => setStep(step === 'reason' ? 'category' : 'reason')}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                disabled={isLoading}
            >
                Retour
            </button>
            ) : (
            <div></div>
            )}

            {step !== 'confirm' ? (
            <button
                type="button"
                onClick={(e) => goToNextStep(e)}
                className="px-4 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded disabled:opacity-50"
                disabled={isLoading}
            >
                Suivant
            </button>
            ) : (
            <button
                type="submit"
                className="px-4 py-2 text-sm bg-orange-600 text-white hover:bg-orange-700 rounded disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? 'Envoi en cours...' : 'Confirmer l\'avertissement'}
            </button>
            )}
        </div>

      </form>

    </div>
  );
};

export default IssueWarningForm;