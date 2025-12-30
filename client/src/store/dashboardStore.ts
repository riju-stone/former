import { create } from "zustand";
import { DashboardState, DashboardActions } from "@/types/dashboardState";

export const defaultDashboardState: DashboardState = {
  isSidebarOpen: false,
  theme: "light"
};

export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  ...defaultDashboardState,
  setIsSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setTheme: (theme) => set({ theme }),
}));