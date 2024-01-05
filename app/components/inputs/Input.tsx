"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  register,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id)}
          className={clsx(
            `form-input 
            block 
            rounded-md 
            w-full 
            border-0 
            ring-1 
            ring-inset
            ring-gray-300 
            py-1.5 
            text-gray-900 
            shadow-sm
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm
            sm:leading-6`,

            errors[id] && "ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
      <p className="text-red-500 text-sm pt-[2px]">
        {errors[id]?.message?.toString()}
      </p>
    </div>
  );
};

export default Input;
