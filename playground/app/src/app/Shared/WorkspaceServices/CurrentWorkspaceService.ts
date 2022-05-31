import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { Workspace } from "./Models";
import { WorkspaceService } from "./WorkspaceService";

@Injectable({ providedIn: "root" })
export class CurrentWorkspaceService {
  #workspace = new BehaviorSubject<Workspace | undefined>(undefined);

  public readonly workspace: Observable<Workspace | undefined> = this.#workspace.asObservable();

  constructor(private service: WorkspaceService) {
    const id = localStorage.getItem("workspace:id");
    if (id) {
      this.activateWorkspace(id);
    }
  }

  isDefined(): boolean {
    return localStorage.getItem("workspace:id") !== undefined;
  }

  unsubscribe(): void {
    this.service.unsubscribe();
  }

  activateWorkspace(id: string): void {
    if (id) {
      localStorage.setItem("workspace:id", id);
    }
    this.service.subscribe(
      {
        criteria: { id },
        limit: 1,
        stream: {
          aggregate: "workspace",
          streamIds: [id]
        }
      },
      (workspace) => {
        if (workspace) {
          console.log(workspace);
          this.#workspace.next(workspace);
        }
      }
    );
  }
}
