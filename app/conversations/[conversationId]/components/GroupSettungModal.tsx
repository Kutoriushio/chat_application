"use client";
import getUsers from "@/app/actions/getUsers";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/modals/Modal";
import useConversation from "@/app/hooks/useConverstaion";
import { Conversation, User } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { VscEdit } from "react-icons/vsc";

interface GroupSettingModalProps {
  onClose: () => void;
  isOpen?: boolean;
  currentConversation: Conversation & {
    users: User[];
  };
  users: User[];
}

const GroupSettungModal: React.FC<GroupSettingModalProps> = ({
  onClose,
  isOpen,
  currentConversation,
  users,
}) => {
  const router = useRouter();
  const session = useSession();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const currentMembers = currentConversation.users.map((user) => ({
    value: user.id,
    label: user.name,
    email: user.email,
  }));
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentConversation.name,
      image: currentConversation.image,
      members: currentMembers,
    },
  });

  const image = watch("image");
  const members = watch("members");
  const styles = {
    multiValue: (base: any, state: { data: any }) => {
      return state.data.email === session.data?.user?.email
        ? { ...base, backgroundColor: "gray" }
        : base;
    },
    multiValueRemove: (base: any, state: { data: any }) => {
      return state.data.email === session.data?.user?.email
        ? { ...base, display: "none" }
        : base;
    },
    multiValueLabel: (base: any, state: { data: any }) => {
      return state.data.email === session.data?.user?.email
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
  };
  const handleUpload = (data: any) => {
    setValue("image", data.info.secure_url, {
      shouldValidate: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post(`/api/conversations/${conversationId}/update`, data)
      .then(() => {
        onClose();
        router.refresh();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast.error("Please add more than 2 people.");
        }
        if (error.response.status === 402) {
          toast.error("Please give a chat name.");
        }
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
    >
      <div className="text-left">
        <div className="text-base font-semibold leading-7 text-gray-900">
          Profile
        </div>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Edit your group information.
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
                options={{ maxFiles: 1, cropping: true }}
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}
                onUpload={handleUpload}
                className="relative"
              >
                <div
                  className={clsx(
                    "w-24 h-24 hover:opacity-80 rounded-full ring-1 ring-gray-900",
                    image && "ring-0"
                  )}
                >
                  <Image
                    fill
                    alt="avatar"
                    src={image || "/images/group_placeholder.png"}
                    className="object-cover object-top rounded-full"
                  />
                </div>
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center absolute right-0 bottom-0">
                  <VscEdit />
                </div>
              </CldUploadButton>
            </div>
          </div>
          <Input label="Name" id="name" register={register} errors={errors} />
          <Select
            disabled={isLoading}
            label="Members"
            onChange={(value) => {
              setValue("members", value, {
                shouldValidate: true,
              });
            }}
            value={members}
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
              email: user.email,
            }))}
            styles={styles}
            isClearable={false}
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
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GroupSettungModal;
