import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LoginData } from "../types/auth";
import { UserStore } from "./UserStore";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (tokens: LoginData) => void;
  clearAuth: () => void;
};

export const AuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ accessToken, refreshToken }) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        UserStore.getState().clearUser();
      },
    }),
    {
      name: "hangarae-auth",

      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
