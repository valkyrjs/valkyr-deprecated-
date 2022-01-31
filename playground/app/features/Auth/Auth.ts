import { Auth } from "@valkyr/auth";

import { socket } from "../../providers/Socket";

let auth = Auth.guest();

async function token(email: string) {
  return socket.send("auth:token", { email });
}

async function login(email: string, token: string) {
  await socket.send("auth:login", { email, token }).then(({ token }) => {
    return resolve(token);
  });
}

async function resolve(token: string) {
  await socket.send("auth:resolve", { token });
  auth = await Auth.resolve(token);
  localStorage.setItem("token", token);
}

async function destroy() {
  await socket.send("auth:destroy");
}

export { auth, destroy, login, resolve, token };
