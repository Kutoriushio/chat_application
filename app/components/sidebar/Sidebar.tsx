import React from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full">
      <MobileFooter />
      <DesktopSidebar currentUser={currentUser!} />
      <main className="h-full lg:pl-20">{children}</main>
    </div>
  );
}

export default Sidebar;
