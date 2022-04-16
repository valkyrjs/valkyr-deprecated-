import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { map } from "rxjs/operators";

export class MessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const [id, data = {}] = context.getArgByIndex(1) ?? [];

    (context as any).args[1] = data;

    return next.handle().pipe(
      map((data: unknown) => ({
        status: "success",
        id,
        data
      }))
    );
  }
}

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);

    const [id] = host.getArgByIndex(1) ?? [];

    if (host.getType() === "ws") {
      (host as any).args[0].send(
        JSON.stringify({
          status: "error",
          id,
          data: new WsException(exception as any)
        })
      );
    }
  }
}
