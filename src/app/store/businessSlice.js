import { createSlice } from "@reduxjs/toolkit";

const businessSlice = createSlice({
  name: "business",
  initialState: { selectedBusiness: null },
  reducers: {
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
    clearSelectedBusiness: (state) => {
      state.selectedBusiness = null;
    }
  }
});

export const { setSelectedBusiness, clearSelectedBusiness } = businessSlice.actions;
export default businessSlice.reducer;
