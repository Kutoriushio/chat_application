"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ClipLoader } from "react-spinners";

const LoadingModal = () => {
  return (
    <Transition.Root show>
      <div className="z-50 relative">
        <Transition.Child
          enter="ease-out durantion-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in durantion-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-90 transition" />
        </Transition.Child>
        <div className="fixed inset-0">
          <div className="flex justify-center items-center h-full w-full">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <ClipLoader size={40} color="#0284c7" />
            </Transition.Child>
          </div>
        </div>
      </div>
    </Transition.Root>
  );
};

export default LoadingModal;
