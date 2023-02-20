import { openModal } from "~Components/Modal";

import { CommandPalette } from "./CommandPalette.Component";

export function openCommandPalette() {
  openModal(<CommandPalette />, "full");
}
