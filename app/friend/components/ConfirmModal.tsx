import Button from "@/app/components/Button";
import Modal from "@/app/components/modals/Modal";
import { Dialog } from "@headlessui/react";
import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex justify-center items-center h-12 w-12 bg-red-100 rounded-full flex-shrink-0 sm:h-10 sm:w-10 sm:mx-0">
          <FiAlertTriangle size={24} className="text-red-600" />
        </div>

        <div className="text-center sm:text-left mt-3 sm:ml-4 sm:mt-0">
          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
            Delete friend
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this firend?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 flex sm:justify-end justify-center gap-5 sm:gap-3">
        <Button secondary onClick={onClose}>
          Cancel
        </Button>
        <Button danger>Delete</Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
