import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types'; // Import the User type

interface AuthState {
  user: User | null; // Use the User type
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user?: User; token: string; refreshToken?: string }>)  {
      state.user = action.payload.user!;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken!;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export default authSlice.reducer;