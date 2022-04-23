import "./App";
import "./Config";

import React from "react";
import { createRoot } from "react-dom/client";

import { Application } from "./Application";

const root = createRoot(document.getElementById("app"));

root.render(<Application />);
