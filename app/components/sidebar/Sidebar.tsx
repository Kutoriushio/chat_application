import React from "react";
import DesktopSidebar from "./DesktopSidebar";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <DesktopSidebar />
      <main className="h-full pl-20">{children}</main>
    </div>
  );
};

export default Sidebar;
