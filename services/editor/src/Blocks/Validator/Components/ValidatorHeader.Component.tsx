import { BlockHeader } from "~Components/BlockHeader";

import { ValidatorHeaderController } from "./ValidatorHeader.Controller";

export const ValidatorHeader = ValidatorHeaderController.view(({ state: { name }, props: { open, onRemove } }) => {
  return <BlockHeader open={open} color="cyan" symbol="V" content={name} onRemove={onRemove} />;
});
