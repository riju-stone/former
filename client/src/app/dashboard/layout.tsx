import CustomSidebarComponent from "@/components/custom/custom-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CustomSidebarComponent />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
