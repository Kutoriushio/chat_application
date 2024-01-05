import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/modals/Modal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      members: "",
    },
  });

  const members = watch("members");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        // router.refresh();
        onClose();
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
          Create a group chat
        </div>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Create a chat with more than 2 people.
        </p>

        <form
          className="mt-5 flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input label="Name" id="name" register={register} errors={errors} />
          <Select
            disabled={isLoading}
            label="Members"
            onChange={(value) => {
              console.log(value);
              setValue("members", value, {
                shouldValidate: true,
              });
            }}
            value={members}
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
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
              Create
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GroupChatModal;
