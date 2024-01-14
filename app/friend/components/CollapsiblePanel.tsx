import { Disclosure, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import React from "react";
import { FaCaretRight } from "react-icons/fa";
import UserBox from "./UserBox";
import clsx from "clsx";

interface CollapsiblePanelProps {
  users: User[];
  label: string;
}
const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  users,
  label,
}) => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-start items-center gap-2 w-full p-2 pl-1 rounded-full hover:bg-sky-200">
            <FaCaretRight
              className={clsx("transform duration-300", open && "rotate-90")}
            />
            <div>{label}</div>
          </Disclosure.Button>
          <Transition
            enter="transition ease-in duration-300 transform"
            enterFrom="opacity-0 -translate-y-3"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-out-in duration-300 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-3"
          >
            <Disclosure.Panel>
              {users.map((user) => (
                <UserBox key={user.id} user={user} />
              ))}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default CollapsiblePanel;
