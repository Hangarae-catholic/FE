import { create } from "zustand";
import type { UserData } from "../types/user";
import { getProfile } from "../apis/user";

type UserState = {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: UserData) => void;
  fetchUser: () => Promise<UserData | null>;
  clearUser: () => void;
};

export const UserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      error: null,
    }),

  fetchUser: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await getProfile();

      if (!response.data) {
        throw new Error("사용자 정보가 없습니다.");
      }

      set({
        user: response.data,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      console.error("프로필 조회 실패:", error);

      set({
        user: null,
        isLoading: false,
        error: "사용자 정보를 불러오지 못했습니다.",
      });

      return null;
    }
  },

  clearUser: () =>
    set({
      user: null,
      isLoading: false,
      error: null,
    }),
}));
