import React, { useState } from "react";
import Modal from "../modals/Modal";
import { User } from "@prisma/client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import Button from "../Button";
import { VscEdit } from "react-icons/vsc";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SettingModalProps {
  onClose: () => void;
  isOpen?: boolean;
  currentUser: User;
}
const SettingModal: React.FC<SettingModalProps> = ({
  onClose,
  isOpen,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser.name,
      image: currentUser.image,
    },
  });

  const image = watch("image");

  const handleUpload = (data: any) => {
    setValue("image", data.info.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/settings", data)
      .then(() => {
        onClose();
        router.refresh();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-left">
        <div className="text-base font-semibold leading-7 text-gray-900">
          Profile
        </div>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Edit your public information.
        </p>

        <form
          className="mt-5 flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Avatar
            </label>
            <div className="mt-2">
              <CldUploadButton
                options={{ maxFiles: 1 }}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}
                onUpload={handleUpload}
                className="relative"
              >
                <div className="w-24 h-24 hover:opacity-80 relative">
                  <Image
                    fill
                    alt="avatar"
                    src={
                      image || currentUser.image || "/images/placeholder.jpg"
                    }
                    className="rounded-full object-cover object-top"
                  />
                </div>
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center absolute right-0 bottom-0">
                  <VscEdit />
                </div>
              </CldUploadButton>
            </div>
          </div>
          <Input label="Name" id="name" register={register} errors={errors} />
          <hr className="mt-5" />
          <div className="flex mt-6 justify-end items-center gap-6">
            <Button secondary onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SettingModal;
