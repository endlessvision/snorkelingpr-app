import { create } from "zustand";

/** Full-screen/global overlays reachable from the + action menu and the Redeem sheet. */
export type OverlayScreen =
  | "logSighting"
  | "miniGames"
  | "gear"
  | "coinRush"
  | "depthGamble"
  | "luckyReels"
  | "wheelOfTides"
  | "scratchSand"
  | "coinShop"
  | "raffle"
  | "leaderboard";

interface UIState {
  /** The centered "Dive tools" 2×2 popup from the + tab. */
  actionMenuOpen: boolean;
  /** The single active full-screen overlay (null = none). */
  screen: OverlayScreen | null;
  /** Transient toast message shown by the global toast (empty = hidden). */
  toast: string;

  toggleActionMenu: () => void;
  closeActionMenu: () => void;
  /** Open a full-screen overlay (also closes the action menu). */
  open: (screen: OverlayScreen) => void;
  close: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useUI = create<UIState>((set) => ({
  actionMenuOpen: false,
  screen: null,
  toast: "",
  toggleActionMenu: () => set((s) => ({ actionMenuOpen: !s.actionMenuOpen })),
  closeActionMenu: () => set({ actionMenuOpen: false }),
  open: (screen) => set({ screen, actionMenuOpen: false }),
  close: () => set({ screen: null }),
  showToast: (msg) => set({ toast: msg }),
  clearToast: () => set({ toast: "" }),
}));
