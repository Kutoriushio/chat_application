import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  id: string;
  register: UseFormRegister<FieldValues>;
  type: string;
  required: boolean;
  placeholder: string;
}
const MessageInput: React.FC<MessageInputProps> = ({
  id,
  register,
  type,
  required,
  placeholder,
}) => {
  return (
    <div className="w-full">
      <input
        id={id}
        type={type}
        {...register(id, { required })}
        placeholder={placeholder}
        className="font-light bg-neutral-100 py-2 px-4 text-black w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
