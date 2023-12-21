import clsx from "clsx";
import Link from "next/link";

interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  return (
    <li onClick={onClick} key={label}>
      <Link
        href={href}
        className={clsx(
          "flex gap-x-3 p-3 text-sm leading-6 font-semibold text-black hover:text-sky-500",
          active && "text-sky-500"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
