import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface MobileItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const MobileItem: React.FC<MobileItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "p-4 w-full items-center flex flex-col gap-1 justify-center leading-6 text-black hover:text-sky-500",
        active && "text-sky-500"
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="font-semibold text-xs">{label}</span>
    </Link>
  );
};

export default MobileItem;
