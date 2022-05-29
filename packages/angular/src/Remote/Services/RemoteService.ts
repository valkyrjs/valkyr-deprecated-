import { Injectable } from "@angular/core";

import { AuthSessionService } from "../../Auth/Services/AuthSessionService";

export class ApiErrorResponse extends Error {
  constructor(readonly code: number, message: string, readonly data: Record<string, unknown>) {
    super(message);
  }
}

@Injectable({ providedIn: "root" })
export class RemoteService {
  constructor(readonly session: AuthSessionService) {}

  /**
   * Perform a post request against given resource.
   *
   * @param endpoint - API endpoint to call.
   * @param data     - Data to submit.
   *
   * @returns Response
   */
  async post<D = unknown, T = unknown>(endpoint: string, data: D): Promise<T> {
    return this.send<T>(endpoint, {
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
  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.send<T>(endpoint, {
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
  async put<T = unknown>(endpoint: string, data: any): Promise<T> {
    return this.send<T>(endpoint, {
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
  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.send<T>(endpoint, {
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
  async send<T = unknown>(endpoint: string, init: RequestInit = {}): Promise<T> {
    try {
      init.headers = {
        "Content-Type": "application/json",
        ...init.headers
      };
      if (this.session.isAuthenticated) {
        (init.headers as any)["authorization"] = `${this.session.user} ${await this.session.getSignedToken()}`;
      }
      return await fetcher<T>(`http://localhost:8370${endpoint}`, init);
    } catch (err: any) {
      throw new ApiErrorResponse(500, err.message, {});
    }
  }
}

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
export async function fetcher<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  const body = await response.text();
  if (body.length === 0) {
    return {} as T;
  }

  const data = JSON.parse(body);
  if (response.status >= 300) {
    throw new ApiErrorResponse(response.status, data.message, data.data ?? {});
  }
  return JSON.parse(body);
}
