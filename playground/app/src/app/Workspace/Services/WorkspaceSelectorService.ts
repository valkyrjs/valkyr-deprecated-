import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class WorkspaceSelectorService {
  #current?: string;

  set current(id: string | undefined) {
    this.#current = id;
  }

  get current(): string | undefined {
    return this.#current;
  }

  isActive(workspaceId: string): boolean {
    return this.#current === workspaceId;
  }
}
