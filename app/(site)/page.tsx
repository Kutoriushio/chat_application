import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-gray-100 justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={48}
          height={48}
          className="mx-auto w-auto"
        />
        <h2 className="text-3xl text-center mt-6 font-bold text-gray-900 tracking-tight">
          Sign in to your account
        </h2>
      </div>
      {/* Auth Form */}
      <AuthForm />
    </div>
  );
}
