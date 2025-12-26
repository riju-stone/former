"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function ProfileComponent({ userData }: { userData: any }) {
  return (
    <>
      <Avatar className="w-8 h-8 rounded-lg">
        <AvatarImage src={userData?.image || undefined} alt={userData?.name || "User Avatar"} />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight">
        <span className="truncate text-gray-700 font-medium text-xs">{userData?.name}</span>
        <span className="truncate text-gray-500 text-xs">{userData?.email}</span>
      </div>
    </>
  );
}

export default React.memo(ProfileComponent);
