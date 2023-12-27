import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => null} className="relative z-50">
        <Transition.Child
          enter="ease-out durantion-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in durantion-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex justify-center items-center min-h-full text-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="bg-white w-full rounded-lg shadow-xl sm:max-w-lg relative transform overflow-hidden p-4 sm:p-6">
                <div className="absolute right-0 top-0 hidden sm:block z-10 pr-4 pt-5">
                  <button
                    type="button"
                    className="text-gray-400 bg-white hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close Panel</span>
                    <IoClose size={24} />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
