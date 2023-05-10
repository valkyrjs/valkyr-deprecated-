import { IncomingMessage, ServerResponse } from "http";

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
