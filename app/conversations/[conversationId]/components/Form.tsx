"use client";
import useConversation from "@/app/hooks/useConverstaion";
import axios from "axios";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import MessageInput from "./MessageInput";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import clsx from "clsx";

const Form = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });
  console.log(errors.message);
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "");
    axios.post("/api/message", {
      ...data,
      conversationId: conversationId,
    });
  };
  return (
    <div className="p-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <MdOutlineAddPhotoAlternate size={30} className="mb-0.5" />
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
            errors.message && "opacity-20 hover:text-black"
          )}
          disabled={!!errors.message}
        >
          <HiOutlinePaperAirplane size={24} />
        </button>
      </form>
    </div>
  );
};

export default Form;
