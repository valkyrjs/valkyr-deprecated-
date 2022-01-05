import React from "react";

import { useRoutingProgress } from "../../Hooks/UseRoutingProgress";

export function RouteLoader(): JSX.Element | null {
  const progress = useRoutingProgress();
  if (progress === 0) {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-200 h-1 w-full z-50">
      <div
        className="absolute h-1 top-0 left-0 bg-indigo-400 transition-all ease-out duration-500"
        style={{
          width: `${progress}%`
        }}
      />
    </div>
  );
}
