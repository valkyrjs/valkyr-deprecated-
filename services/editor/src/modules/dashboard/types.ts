export type EventConfig = {
  type: string;
  data: {
    [key: string]: string;
  };
  meta: {
    [key: string]: string;
  };
};
