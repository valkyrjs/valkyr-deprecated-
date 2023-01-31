import { Subject } from "rxjs";

export const keyboard = new Subject<Key>();

const keys: Record<Key, true> = {
  1: true,
  ArrowLeft: true,
  ArrowRight: true,
  ArrowUp: true,
  ArrowDown: true,
  Enter: true,
  Escape: true
};

window.addEventListener("keyup", (e) => {
  if (keys[e.key] === true) {
    keyboard.next(e.key as Key);
  }
});

type Key = "1" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "Enter" | "Escape";
