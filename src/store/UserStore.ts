import { create } from "zustand";
import type { UserData } from "../types/user";

type UserState = {
  user: UserData | null;

  setUser: (user: UserData) => void;
  clearUser: () => void;
};

export const UserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));
