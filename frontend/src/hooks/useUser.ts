import { TUser } from "../types";
import { create } from "zustand";

interface ModalStore {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
}

const useUser = create<ModalStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUser;
