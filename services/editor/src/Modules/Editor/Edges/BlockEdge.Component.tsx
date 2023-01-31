import { EdgeProps, getBezierPath } from "reactflow";

const foreignObjectSize = 40;

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
  return (
    <>
      <path
        id={id}
        style={style}
        className={`react-flow__edge-path ${data.stroke}`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button className="edgebutton" onClick={() => data.onRemove?.()}>
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
}
