import { config } from "@App/Config";

export const remote = new (class RemoteService {
  /**
   * Perform a post request against given resource.
   *
   * @param endpoint - API endpoint to call.
   * @param data     - Data to submit.
   *
   * @returns Response
   */
  async post<D = unknown, R extends ApiResponseJSON = ApiResponseJSON>(endpoint: string, data: D): Promise<ApiResponse<R>> {
    return this.send<R>(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  /**
   * Perform a get request against given resource.
   *
   * @param endpoint - API endpoint to call.
   *
   * @returns Response
   */
  async get<R extends ApiResponseJSON>(endpoint: string): Promise<ApiResponse<R>> {
    return this.send<R>(endpoint, {
      method: "GET"
    });
  }

  /**
   * Perform a put request against given resource.
   *
   * @param endpoint - API endpoint to call.
   * @param data     - Data to submit.
   *
   * @returns Response
   */
  async put<R extends ApiResponseJSON>(endpoint: string, data: any): Promise<ApiResponse<R>> {
    return this.send<R>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  /**
   * Perform a delete request against given resource.
   *
   * @param endpoint - API endpoint to call.
   *
   * @returns Response
   */
  async delete<R extends ApiResponseJSON>(endpoint: string): Promise<ApiResponse<R>> {
    return this.send<R>(endpoint, {
      method: "DELETE"
    });
  }

  /**
   * Send http/s request to the api.
   *
   * @param endpoint - Endpoint to call.
   * @param init     - RequestInit
   *
   * @returns Response
   */
  async send<R extends ApiResponseJSON>(endpoint: string, init: RequestInit = {}): Promise<ApiResponse<R>> {
    init.headers = {
      "Content-Type": "application/json",
      ...init.headers
    };
    const token = localStorage.getItem("token");
    if (token) {
      (init.headers as any)["authorization"] = `Bearer ${token}`;
    }
    return fetcher<R>(`${config.api.endpoint.http}${endpoint}`, init);
  }
})();

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

/**
 * Fetch wrapper that automatically handles the request and returns resulting JSON.
 *
 * @param input - RequestInfo.
 * @param init  - RequestInit.
 *
 * @returns Response
 */
export async function fetcher<R extends ApiResponseJSON>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<R>> {
  const response = await fetch(input, init);

  const body = await response.text();
  if (body.length === 0) {
    return new EmptySuccessResponse();
  }

  const data = JSON.parse(body) as ApiRemoteResponse<R>;
  if (data.status === undefined) {
    return new ExceptionResponse({
      code: 500,
      message: "Malformed API Response",
      error: {
        response: data,
        expected: {
          status: "success | error",
          code: "number"
        }
      }
    });
  }
  if (data.status === "error") {
    return new ExceptionResponse(data);
  }
  if (data.code === 204 || data.resource === undefined) {
    return new EmptySuccessResponse();
  }
  return new SuccessResponse(data.code, data.resource);
}

/*
 |--------------------------------------------------------------------------------
 | Root Response
 |--------------------------------------------------------------------------------
 */

export abstract class Response {
  abstract readonly status: ApiResponseStatus;
  abstract readonly code: number;

  toJSON() {
    return {
      status: this.status,
      code: this.code
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Base Responses
 |--------------------------------------------------------------------------------
 */

export class SuccessResponse<R extends ApiResponseJSON> extends Response {
  readonly status = "success" as const;

  constructor(readonly code: number, readonly resource: R) {
    super();
  }
}

export class EmptySuccessResponse extends Response {
  readonly status = "empty" as const;
  readonly code = 204 as const;
}

export class ExceptionResponse extends Response {
  readonly status = "error" as const;
  readonly message: string;
  readonly error: ApiResponseJSON;

  constructor(data: any, readonly code = data.code ?? 500) {
    super();
    this.message = data.message ?? "";
    this.error = data.error ?? {};
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type ApiRemoteResponse<R extends ApiResponseJSON> = {
  status: "success" | "error";
  code: number;
  resource?: R;
  message?: string;
  error?: ApiResponseJSON;
};

type ApiResponse<R extends ApiResponseJSON> = SuccessResponse<R> | EmptySuccessResponse | ExceptionResponse;

type ApiResponseStatus = "success" | "empty" | "error";

type ApiResponseJSON = Record<string, unknown>;
