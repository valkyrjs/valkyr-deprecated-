import cors from "@fastify/cors";
import { api } from "@valkyr/api";
import Fastify from "fastify";

export const fastify = Fastify();

fastify.register(cors);
fastify.register(api.fastify);
