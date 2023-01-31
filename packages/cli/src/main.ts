#! /usr/bin/env node

/* eslint-disable simple-import-sort/imports */

import { program } from "./program.js";

import "./commands/generate.js";

program.parse(process.argv);
