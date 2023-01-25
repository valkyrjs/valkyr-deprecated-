import { Controller } from "@valkyr/react";

export class SettingsController extends Controller<{
  isOpen: boolean;
  types: Type[];
}> {
  async onInit() {
    return {
      isOpen: false,
      types: []
    };
  }

  #addType(add: () => void): () => void {
    return () => {
      add();
    };
  }
}

export type Type = {
  name: string;
  description: string;
  add: () => void;
};
