#! /usr/bin/env node

/* eslint-disable simple-import-sort/imports */

import { program } from "./Program.js";

import "./Commands/Generate.js";

program.parse(process.argv);
