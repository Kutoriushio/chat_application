import useUserRoutes from "@/app/hooks/useUserRoutes";
import { User } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface DesktopListProps {
  users: User[];
}
const DesktopList: React.FC<DesktopListProps> = ({ users }) => {
  const routes = useUserRoutes();
  return (
    <div className="hidden lg:block">
      <nav className="mt-2 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-5">
          {routes.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className={clsx(
                "flex text-sm leading-6 font-semibold text-black hover:bg-sky-300 w-full p-3 gap-x-3 rounded-lg",
                item.active && "bg-sky-300"
              )}
            >
              {<item.icon className="h-6 w-6" />}
              <span>{item.label}</span>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DesktopList;
