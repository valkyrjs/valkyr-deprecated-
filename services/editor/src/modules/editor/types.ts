export type Event = {
  name: string;
  data: {
    [key: string]: string;
  };
  meta: {
    [key: string]: string;
  };
};

export type Type = {
  name: string;
  data: {
    [key: string]: string;
  };
};
