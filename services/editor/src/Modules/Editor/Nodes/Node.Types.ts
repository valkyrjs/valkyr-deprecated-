export type ConnectionParams = {
  type: NodeType;
  id: string;
};

export type NodeType = "event" | "state" | "reducer";
