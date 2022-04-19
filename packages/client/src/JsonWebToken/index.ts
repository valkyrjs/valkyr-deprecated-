import { decode } from "./Decode";

export const jwt = {
  set token(value: string | null) {
    if (value === null) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", value);
    }
  },
  get token() {
    return localStorage.getItem("token");
  },
  decode
};
