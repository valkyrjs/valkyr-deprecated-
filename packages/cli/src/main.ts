#! /usr/bin/env node

/* eslint-disable simple-import-sort/imports */

import { program } from "./program";

import "./commands/generate";

program.parse(process.argv);
