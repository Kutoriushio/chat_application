import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full justify-center rounded-md ring-1 rinbg-inset ring-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 focus:outline-offset-0 shadow-sm"
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;