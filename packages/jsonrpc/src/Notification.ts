import { Provider } from "./Provider.js";
import { Params, Request } from "./Request.js";

/**
 * Create a new JSON RPC 2.0 notification factory with the given method and parameter
 * requirements.
 *
 * @param method   - Method name of the rpc notification.
 * @param provider - Provider to send the notification from.
 *
 * @returns method that executes the rpc notification.
 */
export function makeNotificationFactory<P extends Params | void = void>(
  method: string,
  provider: Provider
): (params?: P) => Promise<void> {
  async function factory(params?: Params): Promise<void> {
    if (params === undefined) {
      await provider.notify({
        jsonrpc: "2.0",
        method
      });
    } else {
      await provider.notify({
        jsonrpc: "2.0",
        method,
        params: params as any
      });
    }
  }
  return factory as any;
}

/**
 * A Notification is a Request object without an "id" member. A Request object that is
 * a Notification signifies the Client's lack of interest in the corresponding Response
 * object, and as such no Response object needs to be returned to the client. The Server
 * MUST NOT reply to a Notification, including those that are within a batch request.
 *
 * Notifications are not confirmable by definition, since they do not have a Response
 * object to be returned. As such, the Client would not be aware of any errors (like
 * e.g. "Invalid params","Internal error").
 */
export type Notification<P extends Params | void = void> = Omit<Request<P>, "id">;
