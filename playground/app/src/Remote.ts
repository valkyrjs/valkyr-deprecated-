import { auth } from "./Auth";
import { config } from "./Config";

type SuccessResponse<Data = any> = {
  status: "success";
  data: Data;
};

type ErrorResponse = {
  status: "error";
  code: number;
  message: string;
  details: Record<string, unknown>;
};

type ApiResponse<Data> = SuccessResponse<Data> | ErrorResponse;

export const remote = {
  /**
   * Perform a post request against given resource.
   *
   * @param endpoint - API endpoint to call.
   * @param data     - Data to submit.
   *
   * @returns Response
   */
  async post<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return remote.send(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  /**
   * Perform a get request against given resource.
   *
   * @param endpoint - API endpoint to call.
   *
   * @returns Response
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return remote.send(endpoint, {
      method: "GET"
    });
  },

  /**
   * Perform a put request against given resource.
   *
   * @param endpoint - API endpoint to call.
   * @param data     - Data to submit.
   *
   * @returns Response
   */
  async put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return remote.send(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  /**
   * Perform a delete request against given resource.
   *
   * @param endpoint - API endpoint to call.
   *
   * @returns Response
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return remote.send(endpoint, {
      method: "DELETE"
    });
  },

  /**
   * Perform a SWR resource request.
   *
   * @param endpoint - API endpoint to call.
   *
   * @returns Data
   */
  async swr(endpoint: string): Promise<any> {
    const res = await remote.get(endpoint);
    switch (res.status) {
      case "error": {
        throw new Error(res.message);
      }
      case "success": {
        return res.data;
      }
    }
  },

  /**
   * Send http/s request to the api.
   *
   * @param endpoint - Endpoint to call.
   * @param init     - RequestInit
   *
   * @returns Response
   */
  async send<T = any>(endpoint: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      init.headers = {
        "Content-Type": "application/json",
        ...init.headers
      };
      if (auth.is("authenticated")) {
        // TODO: type this.
        (init.headers as any)["authorization"] = `Bearer ${auth.token}`;
      }
      return await fetcher(`${config.api}${endpoint}`, init);
    } catch (err) {
      return {
        status: "error",
        code: 500,
        message: err.message,
        details: {}
      };
    }
  }
};

/**
 * Fetch wrapper that automatically handles the request and returns resulting JSON.
 *
 * @param input - RequestInfo.
 * @param init  - RequestInit.
 *
 * @returns Response
 */
export async function fetcher(input: RequestInfo, init?: RequestInit): Promise<any> {
  return fetch(input, init).then((r) => {
    if (r.status === 204) {
      return {
        status: "success",
        code: 204,
        data: {}
      };
    }
    return r.json();
  });
}
