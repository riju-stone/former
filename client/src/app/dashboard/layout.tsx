"use client";

import CustomSidebarComponent from "@/components/custom/custom-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "@/lib/authClient";
import React, { useState, useEffect } from "react";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (data?.user) {
      setUserData(data.user);
    }
  }, [data]);

  return (
    <SidebarProvider>
      <CustomSidebarComponent data={userData} />
      <SidebarInset className="h-screen overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
