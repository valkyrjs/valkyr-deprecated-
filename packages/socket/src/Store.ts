import { Message } from "./Message";

/*
 |--------------------------------------------------------------------------------
 | Constants
 |--------------------------------------------------------------------------------
 */

const LOCAL_STORAGE_KEY = "socket:messages";

/*
 |--------------------------------------------------------------------------------
 | Store
 |--------------------------------------------------------------------------------
 */

export class Store {
  public messages: Message[] = getLocalStore();

  public push(message: Message, persist: boolean) {
    if (persist) {
      addToLocalStore(message);
    }
    this.messages.push(message);
  }

  public next() {
    return this.messages[0];
  }

  public resolved(uuid: string) {
    removeFromLocalStore(uuid);
    this.messages = this.messages.filter((message) => message.uuid !== uuid);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function addToLocalStore(message: Message): void {
  const store = getLocalStore();
  store.push(message);
  setLocalStore(store);
}

function removeFromLocalStore(uuid: string): void {
  setLocalStore(getLocalStore().filter((message) => message.uuid !== uuid));
}

function setLocalStore(store: Message[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
}

function getLocalStore(): Message[] {
  const store = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (store) {
    return JSON.parse(store).map(Message.from);
  }
  return [];
}
