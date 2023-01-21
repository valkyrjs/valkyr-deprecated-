import * as dotenv from "dotenv";

dotenv.config();

import "./modules";

import { config } from "./config";
import { fastify } from "./services/fastify";

/*
 |--------------------------------------------------------------------------------
 | Start
 |--------------------------------------------------------------------------------
 */

async function start() {
  fastify.listen({ port: config.port });
}

start();
