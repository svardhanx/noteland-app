// store/authStore.js
import { create } from "zustand";
import { apiEndPoints } from "../utils/apiEndpoints";

export const useAuthStore = create((set) => ({
  user: null,
  userLoggedIn: false,
  authChecked: false, // has the initial ME check resolved yet?
  authenticating: false,
  openLoginComponent: false,
  openSignUpComponent: false,

  setAuthenticating: (val) => set({ authenticating: val }),
  setOpenLoginComponent: (val) => set({ openLoginComponent: val }),
  setOpenSignUpComponent: (val) => set({ openSignUpComponent: val }),
  // in authStore.js
  setUser: (val) => set({ user: val }),
  setUserLoggedIn: (val) => set({ userLoggedIn: val }),

  // Runs once on mount. Only resolves the boolean — cheap, safe to call every load.
  checkAuth: async () => {
    try {
      const res = await fetch(apiEndPoints.ME, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        set({ userLoggedIn: data.isLoggedIn });
      }
    } catch (err) {
      console.error("Error checking auth", err);
    } finally {
      set({ authChecked: true });
    }
  },

  fetchUser: async () => {
    try {
      const res = await fetch(apiEndPoints.GET_USER, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed request: ${res.status}`);
      const data = await res.json();
      if (data.success) set({ user: data.user });
    } catch (err) {
      console.error("Error fetching user", err);
      set({ user: null, userLoggedIn: false });
    }
  },

  logout: () => set({ user: null, userLoggedIn: false }),
}));
