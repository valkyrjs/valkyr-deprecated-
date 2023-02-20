import { X } from "phosphor-react";
import { EdgeProps, getBezierPath } from "reactflow";

import { getColors } from "~Library/BlockColors";

const foreignObjectSize = 24;

export function BlockEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
  markerEnd
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const colors = getColors(data.sourceType);
  return (
    <g className="group">
      <path
        id={`${id}-hitarea`}
        style={style}
        className={`react-flow__edge-path react-flow__edge-path_hitarea`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        id={id}
        style={style}
        className={`react-flow__edge-path ${colors.stroke} ${colors.strokeHover}`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject flex flex-row items-center justify-center"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="scale-0 transition-all duration-200 group-hover:scale-100">
          <button
            className={`edgebutton ${colors.bg} ${colors.bgHover} ${colors.border} ${colors.borderHover} flex h-6 w-6 flex-row items-center justify-center rounded-full border text-white`}
            onClick={() => data.onRemove?.()}
          >
            <X className="h-3" />
          </button>
        </div>
      </foreignObject>
    </g>
  );
}
