import { IncomingMessage, ServerResponse } from "http";

export type CorsOptions = {
  origin: string;
  methods: string;
  optionsSuccessStatus: number;
};

/**
 * Middleware operations to handle for each incoming request.
 *
 * @remarks
 *
 * Sending a response from the function will end the request chain.
 *
 * @param req - Incoming http request message.
 * @param res - Outgoing http response.
 */
export type Middleware = (req: IncomingMessage, res: ServerResponse) => Promise<void>;
