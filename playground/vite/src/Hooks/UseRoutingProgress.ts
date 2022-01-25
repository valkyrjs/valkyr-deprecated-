import { useEffect, useState } from "react";

import { router } from "../Router";

export function useRoutingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    router.addListener("progress", setProgress);
    return (): void => {
      router.removeListener("progress", setProgress);
    };
  }, []);

  return progress;
}
