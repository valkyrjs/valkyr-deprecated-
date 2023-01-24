import { Transition } from "@headlessui/react";
import { X } from "phosphor-react";
import { FunctionComponent, PropsWithChildren } from "react";

import { UnstyledButton } from "../unstyled-button";
import { ModalController, Props } from "./controller";
import { closeModal } from "./index";

/*
 |--------------------------------------------------------------------------------
 | Portal
 |--------------------------------------------------------------------------------
 |
 | Place this portal component in the root of the application where its being
 | used. Currently only one instance can exist as the rxjs subject is a global
 | listener so that the modal can be opened from anywhere in the application.
 |
 */

export const ModalPortal = ModalController.view(({ state: { show, mode, modal }, actions: { close } }) => {
  if (modal === undefined) {
    return null;
  }
  return (
    <Transition
      show={show}
      appear={true}
      onAnimationEnd={close}
      className="fixed inset-0 z-[9998] w-full h-screen flex flex-col justify-center items-center overflow-hidden"
    >
      <Transition.Child
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition easy-in duration-95"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        className="absolute w-full h-screen inset-0 bg-gray-100 bg-opacity-75 z-[9996]"
        onClick={closeModal}
      ></Transition.Child>
      <Transition.Child
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-75"
        enterTo="transform opacity-100 scale-100"
        leave="transition easy-in duration-95"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-75"
        className={`relative z-[9997] ${mode === "full" ? "w-full" : "w-175"} shadow-2xl`}
      >
        {modal}
      </Transition.Child>
    </Transition>
  );
});

export const Modal: FunctionComponent<PropsWithChildren<Props>> = ({ children, title, mode }) => {
  if (mode === "full") {
    return <>{children}</>;
  }

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between w-full py-2.5 px-6 bg-black-static border-b border-gray-300">
        <div className="text-sm uppercase text-gray-600">{title}</div>
        <UnstyledButton onClick={closeModal}>
          <X className="w-4 text-gray-400 hover:text-gray-700" />
        </UnstyledButton>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
};
