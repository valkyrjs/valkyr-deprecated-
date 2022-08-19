export class Debounce {
  timeout?: ReturnType<typeof setTimeout>;

  run(callback: Function, ms: number) {
    this.clear();

    this.timeout = setTimeout(callback, ms);
  }

  clear() {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
  }
}
