import { Controller } from "@valkyr/solid";
import { Subscription } from "rxjs";

import { auth } from "~Services/Auth";
import { AppEventRecord } from "~Services/Ledger/EventRecord";
import { eventStore } from "~Services/Ledger/EventStore";
import { supabase } from "~Services/Supabase";

import { db, Workspace } from "../Database";
import { WorkspaceForm } from "./Workspace.Form";

export class WorkspaceController extends Controller<{
  workspaces: Workspace[];
  form: WorkspaceForm;
}> {
  #workspaces?: Subscription;

  async onInit() {
    await this.#pullWorkspaces();
    this.setState({
      workspaces: [],
      form: new WorkspaceForm({
        name: "",
        user: ""
      }).onError(console.log)
    });
    this.#subscribeToWorkspaces();
  }

  async #pullWorkspaces() {
    const { data: result } = await supabase.from("container_users").select("*").eq("user_id", auth.strictUserId);
    if (result !== null) {
      await Promise.all(result.map(async ({ container_id }) => this.#resolveWorkspaceEvents(container_id)));
    }
  }

  async #resolveWorkspaceEvents(containerId: string) {
    const { data: events } = await supabase
      .from("events")
      .select<"*", AppEventRecord>("*")
      .eq("container", containerId)
      .eq("type", "WorkspaceCreated");
    if (events !== null) {
      for (const event of events) {
        eventStore.insert(event, true);
      }
    }
  }

  #subscribeToWorkspaces() {
    db.collection("workspaces").subscribe({}, {}, (workspaces) => {
      this.state.workspaces = workspaces;
    });
  }

  async onDestroy() {
    this.#workspaces?.unsubscribe();
  }
}
