export type DashboardState = {
  isSidebarOpen: boolean;
  theme: "light" | "dark"
};

export type DashboardActions = {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
};