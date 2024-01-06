"use client";
import useConversation from "@/app/hooks/useConverstaion";
import axios from "axios";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import MessageInput from "./MessageInput";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import clsx from "clsx";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";

const Form = () => {
  const { conversationId } = useConversation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "");
    axios
      .post("/api/messages", {
        ...data,
        conversationId: conversationId,
      })
      .then(() => {
        router.refresh();
      });
  };

  const handleUpload = (data: any) => {
    axios.post("/api/messages", {
      image: data.info.secure_url,
      conversationId: conversationId,
    });
  };

  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}
        onUpload={handleUpload}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className={`${open ? "text-sky-600" : ""}`}
      >
        <MdOutlineAddPhotoAlternate
          size={30}
          className="mb-0.5 hover:text-sky-600"
        />
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 lg:gap-4"
      >
        <MessageInput
          id="message"
          register={register}
          type="text"
          required
          placeholder="Send a message..."
        />
        <button
          type="submit"
          className={clsx(
            "hover:text-sky-600 p-2 rounded-full transition",
            (errors.message || !isDirty) && "hover:!text-black opacity-20 "
          )}
          disabled={!isDirty || !!errors.message}
        >
          <HiOutlinePaperAirplane size={24} />
        </button>
      </form>
    </div>
  );
};

export default Form;
