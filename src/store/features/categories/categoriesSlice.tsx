import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../../types';

interface CategoriesState {
  data: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoriesState = {
  data: [],
status: 'idle',
  error: null,
};

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk<Category[]>(
  'categories/fetchCategories',
  async () => {
    const domain = import.meta.env.VITE_MAIN_DOMAIN;
    const response = await fetch(`${domain}/api/communaute-categories/`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: Category[] = await response.json();
    return data;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.status = 'idle';
      // Optionally reset other state values if needed
      // state.error = null;
      // Don't reset the data to avoid flickering: state.data = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { resetCategoryState } = categoriesSlice.actions;
export default categoriesSlice.reducer;
