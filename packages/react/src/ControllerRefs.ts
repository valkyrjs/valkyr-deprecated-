const refs = new Map<string, HTMLElement>();

export class ControllerRefs {
  #refs = new Map<string, HTMLElement>();

  #forwarded: string[] = [];

  set(name: string) {
    return (element: HTMLElement | null) => {
      if (element !== null) {
        refs.set(name, element);
      }
    };
  }

  forward(name: string) {
    return (element: HTMLElement | null) => {
      if (element !== null) {
        refs.set(name, element);
        this.#forwarded.push(name);
      }
    };
  }

  get(name: string) {
    const element = this.#refs.get(name) ?? refs.get(name);
    if (element === undefined) {
      throw new Error(`Reference Exception: ${name} is not defined.`);
    }
    return element;
  }

  async on(name: string, count = 0): Promise<HTMLElement | undefined> {
    if (count > 20) {
      return undefined;
    }
    const element = this.#refs.get(name) ?? refs.get(name);
    if (element === undefined) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return this.on(name, count + 1);
    }
    return element;
  }

  destroy() {
    this.#forwarded.forEach((name) => {
      refs.delete(name);
    });
  }
}
