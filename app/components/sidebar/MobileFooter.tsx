"use client";

import useConversation from "@/app/hooks/useConverstaion";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }
  return (
    <div className="bottom-0 fixed flex justify-between w-full items-center bg-white border-t-[1px] lg:hidden z-40">
      {routes.map((route) => (
        <MobileItem
          key={route.label}
          label={route.label}
          href={route.href}
          icon={route.icon}
          active={route.active}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
