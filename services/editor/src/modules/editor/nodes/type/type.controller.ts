import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { TypeNodeData } from "./type.node";

export class TypeNodeController extends Controller<{}, Node<TypeNodeData>> {}
