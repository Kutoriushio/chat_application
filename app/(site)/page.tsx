import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-gray-100 justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="flex justify-center items-center">
        <Image src="/images/logo.png" alt="logo" width={64} height={64} />
      </div>
      {/* Auth Form */}
      <AuthForm />
    </div>
  );
}
