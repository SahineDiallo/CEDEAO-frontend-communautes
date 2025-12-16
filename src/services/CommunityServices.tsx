
import { Communaute } from "../models/CommunityType";
import { Category } from "../types";
import API_BASE_URL  from '../constantes/api';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/`);
    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
};

/**
 * Récupère la liste des communautés depuis l'API.
 */
export const fetchCommunities = async (): Promise<Communaute[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/communautes/`);
    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
};

interface CommunauteDetailsCount {
  ressources: number;
  institutions: number;
  discussions: number;
  membres: number;
}

export const fetchCommunauteDetailsCount = async (
  pkId: string | undefined
): Promise<CommunauteDetailsCount> => {
  if (!pkId) {
    console.warn('No community ID provided');
    return {
      ressources: 0,
      institutions: 0,
      discussions: 0,
      membres: 0
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/communautesDetails/count/${pkId}/`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers if needed
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching community details:', error);
    // Return fallback data with proper typing
    return {
      ressources: 0,
      institutions: 0,
      discussions: 0,
      membres: 0
    };
  }
};
/**
 * Ajoute une nouvelle communauté à l'API.
 * @param newCommunity - Les données de la nouvelle communauté à ajouter.
 */
export const addCommunity = async (formData: FormData): Promise<Communaute> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/addComminities  `, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to add community');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding community:', error);
    throw error;
  }
};





