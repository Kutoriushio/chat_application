import { usePathname } from "next/dist/client/components/navigation";
import { useMemo } from "react";
import { FiUser, FiUserCheck, FiUsers } from "react-icons/fi";

const useUserRoutes = () => {
  const pathname = usePathname();
  const routes = useMemo(
    () => [
      {
        label: "Online friends",
        href: "/friend/online",
        icon: FiUser,
        active: pathname === "/friend/online",
      },
      {
        label: "My friends",
        href: "/friend/all",
        icon: FiUsers,
        active: pathname === "/friend/all",
      },
      {
        label: "Friend requests",
        href: "/friend/request",
        icon: FiUserCheck,
        active: pathname === "/friend/request",
      },
    ],
    [pathname]
  );
  return routes;
};

export default useUserRoutes;
