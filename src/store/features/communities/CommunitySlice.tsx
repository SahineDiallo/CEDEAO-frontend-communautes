import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Community } from '../../../types';
import { fetchCommunauteDetailsCount } from '../../../services/CommunityServices';


interface FilterParams {
  query: string;
  type: string;
  category: string;
}

interface CommunauteDetailsCount {
  membres: number;
  institutions: number;
  ressources: number;
  discussions: number;
}

interface CommunitiesState {
  data: Community[];
  filteredData: Community[];
  featuredCommunity: Community | null;
  featuredCommunityDetails: CommunauteDetailsCount | null; // New field
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  filteredStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  detailsStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // New status
  error: string | null;
  filteredError: string | null;
  detailsError: string | null; // New error field
}

const initialState: CommunitiesState = {
  data: [],
  filteredData: [],
  featuredCommunity: null,
  featuredCommunityDetails: null,
  status: 'idle',
  filteredStatus: 'idle',
  detailsStatus: 'idle',
  error: null,
  filteredError: null,
  detailsError: null,
};

// Thunk for fetching all communities
export const fetchCommunities = createAsyncThunk<Community[]>(
  'communities/fetchCommunities',
  async () => {
    const domain = import.meta.env.VITE_MAIN_DOMAIN;
    const response = await fetch(`${domain}/api/communautes/`);
    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }
    return await response.json();
  }
);

// Thunk for fetching filtered communities
export const fetchFilteredCommunities = createAsyncThunk<Community[], FilterParams>(
  'communities/fetchFilteredCommunities',
  async (filters) => {
    const domain = import.meta.env.VITE_MAIN_DOMAIN;
    const queryParams = new URLSearchParams();
    
    if (filters.query) queryParams.append('community_name', filters.query);
    if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
    if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
    
    const response = await fetch(`${domain}/api/communautes/?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch filtered communities');
    }
    return await response.json();
  }
);

// Thunk for fetching community details count
export const fetchFeaturedCommunityDetails = createAsyncThunk<CommunauteDetailsCount, string>(
  'communities/fetchFeaturedCommunityDetails',
  async (communityId) => {
    return await fetchCommunauteDetailsCount(communityId);
  }
);

const communitiesSlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    setFeaturedCommunity: (state, action: PayloadAction<Community>) => {
      state.featuredCommunity = action.payload;
      state.featuredCommunityDetails = null; // Reset details when community changes
      state.detailsStatus = 'idle'; // Reset loading state
    },
    resetCommunityState: (state) => {
      state.status = 'idle';
    },
    resetFilteredCommunities: (state) => {
      state.filteredData = [];
      state.filteredStatus = 'idle';
      state.filteredError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all communities
      .addCase(fetchCommunities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        if (action.payload.length > 0) {
          const randomIndex = Math.floor(Math.random() * action.payload.length);
          state.featuredCommunity = action.payload[randomIndex];
        }
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch communities';
      })

      // Fetch filtered communities
      .addCase(fetchFilteredCommunities.pending, (state) => {
        state.filteredStatus = 'loading';
      })
      .addCase(fetchFilteredCommunities.fulfilled, (state, action) => {
        state.filteredStatus = 'succeeded';
        state.filteredData = action.payload;
      })
      .addCase(fetchFilteredCommunities.rejected, (state, action) => {
        state.filteredStatus = 'failed';
        state.filteredError = action.error.message || 'Failed to fetch filtered communities';
      })

      // Fetch featured community details
      .addCase(fetchFeaturedCommunityDetails.pending, (state) => {
        state.detailsStatus = 'loading';
      })
      .addCase(fetchFeaturedCommunityDetails.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.featuredCommunityDetails = action.payload;
      })
      .addCase(fetchFeaturedCommunityDetails.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.detailsError = action.error.message || 'Failed to fetch community details';
      });
  },
});

export const { 
  setFeaturedCommunity, 
  resetCommunityState, 
  resetFilteredCommunities 
} = communitiesSlice.actions;

export default communitiesSlice.reducer;