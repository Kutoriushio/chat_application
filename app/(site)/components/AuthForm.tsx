"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type Variant = "LOGIN" | "REGISTER";
const AuthForm = () => {
  const session = useSession();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });
  useEffect(() => {
    if (session?.status === "authenticated") {
      window.location.href = "/friend";
    }
  }, [session?.status]);

  const toggleVariant = () => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver<FieldValues>(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
          })
        )
        .catch(() => toast.error("This email address is already exist!"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error === "Invalid email address") {
            toast.error("This email address does not exist!");
          } else if (callback?.error === "Invalid password") {
            toast.error("The password is not correct!");
          }

          if (!callback?.error && callback?.ok) {
            toast.success("Logged in!");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { callbackUrl: "/friend" })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Something went wrong!");
        }

        if (!callback?.error && callback?.ok) {
          toast.success("Logged in!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <h2 className="text-3xl text-center mt-6 font-bold text-gray-900 tracking-tight">
        {variant === "LOGIN"
          ? "Sign in to your account"
          : "Create a new account"}
      </h2>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {variant === "REGISTER" && (
              <Input
                id="name"
                label="Name"
                register={register}
                disabled={isLoading}
                errors={errors}
              />
            )}
            <Input
              id="email"
              label="Email address"
              register={register}
              disabled={isLoading}
              errors={errors}
            />
            <Input
              id="password"
              label="Password"
              register={register}
              disabled={isLoading}
              errors={errors}
              type="password"
            />
            <div>
              <Button disabled={isLoading} fullWidth type="submit">
                {variant === "LOGIN" ? "Sign in" : "Register"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="flex items-center absolute inset-0">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => socialAction("github")}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => {
                  socialAction("google");
                }}
              />
            </div>
          </div>

          <div className="mt-6 text-gray-500 text-sm flex gap-2 justify-center px-2">
            <div>
              {variant === "LOGIN"
                ? "New to MelonChat?"
                : "Already have an account?"}
            </div>
            <div
              onClick={toggleVariant}
              className="text-sky-600 cursor-pointer hover:underline hover:text-sky-700"
            >
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
