import { openModal } from "~Components/Modal";

import { LibraryModal } from "./Library.Component";

export function openLibraryModal() {
  openModal(<LibraryModal />);
}
