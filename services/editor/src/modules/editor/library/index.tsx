import { openModal } from "~components/modal";

import { LibraryModal } from "./library.view";

export function openLibraryModal() {
  openModal(<LibraryModal />);
}
