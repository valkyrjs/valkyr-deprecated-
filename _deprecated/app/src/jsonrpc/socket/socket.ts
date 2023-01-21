import { config } from "../config";
import { messages } from "./messages";

let _socket: WebSocket | undefined;

export async function socket(): Promise<WebSocket> {
  return new Promise<WebSocket>((resolve) => hasConnection(resolve, getSocket()));
}

function hasConnection(resolve: Function, socket: WebSocket): void {
  if (socket.readyState === socket.OPEN) {
    return resolve(socket);
  }
  setTimeout(hasConnection, 250, resolve, socket);
}

function getSocket(): WebSocket {
  if (_socket === undefined) {
    _socket = new WebSocket(config.ws);
    _socket.onmessage = onMessage;
    _socket.onclose = onClose;
  }
  return _socket;
}

function onMessage(msg: MessageEvent<string>): void {
  messages.next(JSON.parse(msg.data));
}

function onClose(): void {
  _socket = undefined;
}

// function getBrowserId(): string {
//   let id = localStorage.getItem("browser:id");
//   if (id === null) {
//     id = crypto.randomUUID();
//     localStorage.setItem("browser:id", id);
//   }
//   return id;
// }
