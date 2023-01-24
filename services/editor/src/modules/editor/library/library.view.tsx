import { Modal } from "~components/modal/view";
import { UnstyledButton } from "~components/unstyled-button";

import { LibraryController } from "./library.controller";

export const LibraryModal = LibraryController.view(({ state: { blocks } }) => {
  return (
    <Modal title="Library">
      <div className="w-[800px] h-[80vh] flex flex-row gap-0">
        <div className="w-44 h-full">
          <h6 className="text-xs">LIBRARY</h6>
        </div>
        <div className="w-full min-h-full flex gap-6">
          {blocks.map((block) => (
            <div
              key={block.name}
              className="relative w-48 h-36 border rounded-sm bg-cta-default text-black flex flex-col justify-start items-start gap-2 p-2"
            >
              <h6 className="text-sm uppercase">{block.name}</h6>
              <p className="text-xs">{block.description}</p>
              <UnstyledButton className="absolute inset-0" onClick={block.add}></UnstyledButton>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
});
