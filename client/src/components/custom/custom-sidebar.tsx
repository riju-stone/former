"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "../ui/sidebar";
import { Home, Blocks, Radio, Save, Settings } from "lucide-react";
import Link from "next/dist/client/link";

const items = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
  },
  {
    title: "Builder",
    url: "/dashboard/builder",
    icon: Blocks,
  },
  {
    title: "Live",
    url: "/dashboard/live-forms",
    icon: Radio,
  },
  {
    title: "Saved",
    url: "/dashboard/saved-forms",
    icon: Save,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

function CustomSidebarComponent() {
  return (
    <React.Fragment>
      <SidebarTrigger className="absolute top-2 left-2 z-50" />
      <Sidebar>
        <SidebarContent className="mt-10">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="text-sm text-gray-500 p-4">v1.0.0</div>
        </SidebarFooter>
      </Sidebar>
    </React.Fragment>
  );
}

export default CustomSidebarComponent;
