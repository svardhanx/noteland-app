// store/authStore.js
import { create } from "zustand";
import { apiEndPoints } from "../utils/apiEndpoints";

export const useAuthStore = create((set) => ({
  user: null,
  userLoggedIn: false,
  authChecked: false,
  authenticating: false,
  openLoginComponent: false,
  openSignUpComponent: false,

  setAuthenticating: (val) => set({ authenticating: val }),
  setOpenLoginComponent: (val) => set({ openLoginComponent: val }),
  setOpenSignUpComponent: (val) => set({ openSignUpComponent: val }),
  // in authStore.js
  setUser: (val) => set({ user: val }),
  setUserLoggedIn: (val) => set({ userLoggedIn: val }),

  initializeAuth: async () => {
    try {
      const res = await fetch(apiEndPoints.ME, { credentials: "include" });
      if (!res.ok) {
        set({ user: null, userLoggedIn: false });
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        set({ user: data.user, userLoggedIn: true });
      } else {
        set({ user: null, userLoggedIn: false });
      }
    } catch (err) {
      console.error("Error initializing authentication", err);
      set({ user: null, userLoggedIn: false });
    } finally {
      set({ authChecked: true });
    }
  },

  logout: () => set({ user: null, userLoggedIn: false }),
}));
