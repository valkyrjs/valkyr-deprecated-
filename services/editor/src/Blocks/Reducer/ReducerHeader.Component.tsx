import { BlockHeader } from "~Components/BlockHeader";

import { ReducerHeaderController } from "./ReducerHeader.Controller";

export const ReducerHeader = ReducerHeaderController.view(({ state: { name }, props: { open, onRemove } }) => {
  return <BlockHeader open={open} color="cyan" symbol="R" content={name} onRemove={onRemove} />;
});
