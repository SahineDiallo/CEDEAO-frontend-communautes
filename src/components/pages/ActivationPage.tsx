// ActivationPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ActivationPage: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const domain = import.meta.env.VITE_MAIN_DOMAIN
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const hasActivated = useRef(false);
  useEffect(() => {
    const activateUser = async () => {
      if (uid && token && !hasActivated.current) {
        hasActivated.current = true;
        try {
          // Send activation request to Djoser using fetch
          const response = await fetch(`${domain}/api/v1/auth/users/activation/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, token }),
          });
  
          if (response.status === 204) {
            // Activation successful, redirect to login page with success message
            navigate('/login', {
              state: { message: 'Votre compte a été activé avec succès. Veuillez vous connecter.' },
            });
          } else {
            // Handle other status codes (e.g., 400 for bad request)
            const data = await response.json();
            setError(data.detail || "L'activation a échoué. Veuillez réessayer.");
          }
        } catch (error) {
          console.error('Activation failed:', error);
          setError("Une erreur s'est produite. Veuillez réessayer.");
        } finally {
          setIsLoading(false); // Stop loading
        }

      }
    };

    activateUser();
  }, [uid, token, navigate, domain]);

  if (isLoading) {
    // Display a loading skeleton
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-300 rounded"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    // Display error message
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return null; // Default return (should not be reached)
};

export default ActivationPage;