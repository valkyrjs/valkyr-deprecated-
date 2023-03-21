import { createBrowserHistory, Router } from "@valkyr/router";
import { Component } from "solid-js";

export const router = new Router<Component>(createBrowserHistory());
