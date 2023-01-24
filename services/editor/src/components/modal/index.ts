import { ReactElement } from "react";
import { Subject } from "rxjs";

export type ModalMode = "full" | "auto";

export const modal = new Subject<{ mode: ModalMode; modal?: ReactElement }>();

export function openModal(element: ReactElement, mode: "full" | "auto" = "auto") {
  modal.next({ mode, modal: element });
}

export function closeModal() {
  modal.next({ mode: "auto", modal: undefined });
}
