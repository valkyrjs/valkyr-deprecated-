import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

import { RootResponse } from "./Api";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof RootResponse) {
      response.status(exception.code).json(exception.toJSON());
    } else {
      response.status(500).json({
        status: "error",
        code: 500,
        message: "Internal Server Error",
        error: {
          type: "Malformed error produced by the internal services",
          exception
        }
      });
    }
  }
}
