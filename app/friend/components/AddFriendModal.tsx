import Button from "@/app/components/Button";
import Modal from "@/app/components/modals/Modal";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/app/components/inputs/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AddFriendModalProps {
  isOpen?: boolean;
  onClose: () => void;
}
const AddFriendModal: React.FC<AddFriendModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver<FieldValues>(schema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/friend/add", data)
      .then(() => {
        router.refresh();
        toast.success("Request sent successfully!");
        reset();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data === "User not found") {
          toast.error("Can't find the user, please check the email.");
        }
        if (error.response.data === "Already sent request") {
          toast.error("You have already sent the request to this user.");
        }
        if (error.response.data === "Invaild data") {
          toast.error("Invaild email, please check the email.");
        }
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal
      onClose={() => {
        onClose();
        reset();
      }}
      isOpen={isOpen}
    >
      <div className="text-left">
        <div className="text-base font-semibold leading-7 text-gray-900">
          Add a new friend
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-500">
          Need user&apos;s email to add a new friend
        </p>
        <form
          className="mt-2 flex flex-col gap-1.5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Email"
            id="email"
            type="text"
            register={register}
            disabled={isLoading}
            errors={errors}
          />
          <hr className="mt-5" />
          <div className="flex mt-6 justify-end items-center gap-6">
            <Button
              secondary
              onClick={() => {
                onClose();
                reset();
              }}
              disabled={isLoading}
              type="button"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Send Request
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddFriendModal;
