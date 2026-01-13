import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";

// Helper function to load user data from AsyncStorage

const loadUserFromStorage = async (): Promise<unknown | null> => {
  try {
    const userInfo = await localStorage.getItem("activeAccount");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Error loading user from storage:", error);
    return null;
  }
};

// Define the initial state and types for auth
interface AuthState {
  user: unknown | null; // Replace `any` with your user type
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};


// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUserAction: (state, action: PayloadAction<unknown>) => {
      state.user = action.payload; // Replace `any` with your user type
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem("activeAccount", JSON.stringify(action.payload));
    },
    logoutUserAction: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem("activeAccount");
    },
    setUserAction: (state, action: PayloadAction<unknown>) => {
      state.user = action.payload; // Replace `any` with your user type
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLoadingAction: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

// Export the actions
export const {
  loginUserAction,
  logoutUserAction,
  setUserAction,
  setLoadingAction,
} = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Thunk to load user data from AsyncStorage
export const loadUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoadingAction(true));
  try {
    const userInfo = await loadUserFromStorage();
    if (userInfo) {
      dispatch(setUserAction(userInfo));
    } else {
      dispatch(setLoadingAction(false)); // No user found, stop loading
    }
  } catch (error) {
    console.error("Error loading user:", error);
    dispatch(setLoadingAction(false));
  }
};

