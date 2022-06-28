import { BadRequestException, HttpException, HttpServer, INestApplication, NotFoundException } from "@nestjs/common";
import { CustomTransportStrategy, Server } from "@nestjs/microservices";
import * as express from "express";

import { CommandHandler, commands } from "./Commands";

/**
 * Command Server
 *
 * A light weight http based microservice for valkyr ledger commands.
 */
export class CommandServer extends Server implements CustomTransportStrategy {
  constructor(readonly options: CommandServerOptions) {
    super();
  }

  /**
   * Create a new JsonRpcServer microservice strategy object which can be
   * applied directly on a NestJS application using connectMicroservice.
   *
   * @example
   *
   * ```ts
   * const app = await NestFactory.create(AppModule);
   * app.connectMicroservice(CommandServer.for(app));
   * await app.startAllMicroservices();
   * ```
   *
   * @param app - Nest application instance.
   */
  static for(app: INestApplication) {
    return {
      strategy: new this({
        path: "/commands",
        adapter: app.getHttpAdapter()
      })
    };
  }

  /**
   * Starts microservice instance listener and create a POST route listener
   * for the configured JSON-RPC endpoint. This approach is used to allow
   * for handling multiple message types on a single endpoint.
   */
  listen(callback: () => void): void {
    const { adapter, path } = this.options;
    adapter.getInstance().post(path, express.json(), async (req: express.Request, res: express.Response) => {
      try {
        const command = this.#getCommandRequest(req.body);
        const identity = this.#getIdentity(req.headers.authorization);
        await this.#handleCommand(command, identity);
        res.status(204).send();
      } catch (err) {
        if (err instanceof HttpException) {
          res.status(err.getStatus()).json(err);
        } else {
          res.status(500).json(err);
        }
      }
    });
    callback();
  }

  close(): void {}

  // ### Request Resolvers

  #getCommandRequest(body: CommandRequestCandidate): CommandRequest {
    if (body.type === undefined) {
      throw new BadRequestException("Command Violation: Missing required 'type' on request body");
    }
    if (body.id === undefined) {
      throw new BadRequestException("Command Violation: Missing required 'id' on request body");
    }
    return {
      id: body.id,
      type: body.type,
      data: body.data ?? {}
    };
  }

  async #getIdentity(token?: string): Promise<any> {
    if (token) {
      // return identity or throw error
    }
    // return guest identity
  }

  // ### Command Handlers

  // temporary disable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async #handleCommand(command: CommandRequest, identity: any): Promise<void> {
    // const handler = this.#getCommandHandler(command.type);
  }

  #getCommandHandler(type: string): CommandHandler {
    const handler = commands.get(type);
    if (handler === undefined) {
      throw new NotFoundException(
        `Command Violation: Handler for command '${type}' does not exist, or has been removed.`
      );
    }
    return handler;
  }
}

export type CommandServerOptions = {
  /**
   * The path at which the JSON RPC endpoint should be mounted
   */
  path: string;

  /**
   * The HTTP Server provided by the Nest runtime
   */
  adapter: HttpServer;
};

export type CommandRequest = {
  id: string;
  type: string;
  data: any;
};

type CommandRequestCandidate = Partial<CommandRequest>;
