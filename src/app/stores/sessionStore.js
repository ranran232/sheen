import { create } from "zustand";

const useSessionStore = create((set) => ({
  session: null,
  loading: true, // track loading
  setSession: (session) => set({ session, loading: false }), // update loading
  clearSession: () => set({ session: null, loading: false }), // also clear loading
}));

export default useSessionStore;