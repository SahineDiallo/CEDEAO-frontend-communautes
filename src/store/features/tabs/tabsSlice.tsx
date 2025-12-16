import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabsState {
  activeTab: string;
}

const initialState: TabsState = {
  activeTab: 'À Propos',
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = tabsSlice.actions;
export default tabsSlice.reducer;
