import { Transition } from "@headlessui/react";
import { X } from "phosphor-react";
import { FunctionComponent, PropsWithChildren } from "react";

import { UnstyledButton } from "../UnstyledButton";
import { closeModal } from "./index";
import { ModalController, Props } from "./Modal.Controller";

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
      className="fixed inset-0 z-[9998] flex h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <Transition.Child
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition easy-in duration-95"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        className="bg-back absolute inset-0 z-[9996] h-screen w-full bg-opacity-90"
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
    <div className="bg-darker">
      <div className="bg-darker border-darker-800 flex w-full items-center justify-between border-b py-2.5 px-6">
        <div className="text-light text-sm uppercase">{title}</div>
        <UnstyledButton onClick={closeModal}>
          <X className="text-darker-700 hover:text-darker-600 w-4" />
        </UnstyledButton>
      </div>
      <div className="text-light px-6 py-6">{children}</div>
    </div>
  );
};
