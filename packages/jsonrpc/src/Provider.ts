import { Notification } from "./Notification.js";
import { Request } from "./Request.js";
import { ErrorResponse, SuccessResponse } from "./Response.js";

export interface Provider {
  /**
   * Submit a JSON RPC 2.0 notification to the provider.
   *
   * @param message - Notification to send to the provider.
   */
  notify(message: Notification): Promise<void>;

  /**
   * Send a single JSON RPC 2.0 request to the provider.
   *
   * @param message - Request to send to the provider.
   */
  send<Result = unknown>(message: Request): Promise<SuccessResponse<Result>>;

  /**
   * Send multiple JSON RPC 2.0 requests and/or notifications to the provider.
   *
   * @param messages - Requests and/or notifications to send to the provider.
   */
  batch(messages: Array<Request | Notification>): Promise<Array<SuccessResponse | ErrorResponse>>;
}
