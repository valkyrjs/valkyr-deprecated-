import { openModal } from "~components/modal";

import { LibraryModal } from "./view";

export function openLibraryModal() {
  openModal(<LibraryModal />);
}
