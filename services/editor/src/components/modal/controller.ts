import { Controller } from "@valkyr/react";
import { ReactElement } from "react";

import type { ModalMode } from "./index";
import { modal } from "./index";

export class ModalController extends Controller<{
  show: boolean;
  mode: ModalMode;
  modal?: ReactElement;
}> {
  async onInit() {
    this.subscribe(modal, async ({ mode, modal }) => {
      if (modal === undefined) {
        return { show: false, mode: "auto" };
      } else {
        return { show: true, mode, modal };
      }
    });
  }

  close() {
    this.setState({
      show: false,
      mode: "auto",
      modal: undefined
    });
  }
}

export type Props = {
  title?: string;
  mode?: ModalMode;
};
