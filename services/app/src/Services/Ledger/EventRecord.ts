import { EventToRecord } from "@valkyr/ledger";

import { TodoEvent } from "~Modules/Todo/Events";
import { WorkspaceEvent } from "~Modules/Workspace/Events";

export type AppEventRecord = EventToRecord<WorkspaceEvent | TodoEvent>;
