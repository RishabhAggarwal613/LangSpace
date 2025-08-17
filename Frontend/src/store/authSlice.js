import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
