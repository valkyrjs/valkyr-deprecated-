import { Modal } from "~Components/Modal";
import { UnstyledButton } from "~Components/UnstyledButton";

import { LibraryController } from "./Library.Controller";

export const LibraryModal = LibraryController.view(({ state: { blocks, templates } }) => {
  return (
    <Modal title="Library">
      <div className="flex h-[80vh] w-[50rem] flex-row gap-0">
        <div className="h-full w-44">
          <h6 className="text-xs">Blocks</h6>
        </div>
        <div className="flex min-h-full w-full flex-col gap-6">
          <div className="grid grid-flow-row-dense grid-cols-3 gap-3">
            {blocks.map((block) => (
              <div
                key={block.type}
                className="hover:border-darker-500 border-darker-800 bg-darker-800 text-light relative flex h-36 w-full flex-col items-start justify-start  gap-2 rounded border p-2 transition-all duration-200 hover:scale-105"
              >
                <h6 className="text-sm uppercase">{block.type}</h6>
                <p className="text-light-200 text-xs">{block.description}</p>
                <UnstyledButton className="absolute inset-0" onClick={block.add}></UnstyledButton>
              </div>
            ))}
          </div>
          <div className="grid grid-flow-row-dense grid-cols-3 gap-3">
            {templates.map((block) => (
              <div
                key={block.name}
                className="hover:border-darker-500 border-darker-800 bg-darker-800 text-light relative flex h-36 w-full flex-col items-start justify-start  gap-2 rounded border p-2 transition-all duration-200 hover:scale-105"
              >
                <h6 className="text-sm uppercase">{block.name}</h6>
                <p className="text-light-200 text-xs">{block.description}</p>
                <UnstyledButton className="absolute inset-0" onClick={block.add}></UnstyledButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
});
