import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Dialog, Transition } from "@headlessui/react";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import React, { Fragment, useMemo, useState } from "react";
import { IoClose, IoTrash } from "react-icons/io5";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ProfileDrawerProps {
  data: Conversation & {
    users: User[];
  };
  isOpen: boolean;
  onClose: () => void;
  statusText: string;
}
const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  data,
  isOpen,
  onClose,
  statusText,
}) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const joinedDate = format(new Date(otherUser.createdAt), "PP");

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          onClose={confirmOpen ? () => null : onClose}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="pointer-events-none fixed inset-y-0 flex right-0 max-w-full pl-10">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                <div className="bg-white h-full shadow-xl py-6 flex flex-col gap-6">
                  <div className="flex justify-end items-start px-4 sm:px-6 ml-3">
                    <button
                      onClick={onClose}
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    >
                      <IoClose size={24} />
                      <span className="sr-only">Close panel</span>
                    </button>
                  </div>

                  <div className="flex flex-col items-center px-4 sm:px-6">
                    {data.isGroup ? (
                      <AvatarGroup users={data.users} />
                    ) : (
                      <Avatar user={otherUser} />
                    )}

                    <div className="mt-2">{title}</div>
                    <div className="text-sm text-neutral-800">{statusText}</div>
                    <div
                      className="flex flex-col gap-2 mt-5 cursor-pointer hover:opacity-75"
                      onClick={() => setConfirmOpen(true)}
                    >
                      <div className="flex justify-center items-center text-red-400 bg-neutral-100 rounded-full w-10 h-10">
                        <IoTrash size={20} />
                      </div>
                      <div className="text-sm font-light text-neutral-600">
                        Delete
                      </div>
                    </div>

                    <div className="w-full py-5">
                      <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                        {data.isGroup && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40">
                              Emails
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 flex flex-col gap-2">
                              {data.users.map((user) => (
                                <div
                                  key={user.id}
                                  className="flex justify-between items-center"
                                >
                                  <span>{user.name}</span>
                                  <div>{user.email}</div>
                                </div>
                              ))}
                            </dd>
                          </div>
                        )}
                        {!data.isGroup && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500 sm:w-40">
                              Email
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                              {otherUser.email}
                            </dd>
                          </div>
                        )}
                        {!data.isGroup && (
                          <>
                            <hr />
                            <div>
                              <dt className="text-sm font-medium text-gray-500 sm:w-40">
                                Joined
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                {joinedDate}
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ProfileDrawer;
