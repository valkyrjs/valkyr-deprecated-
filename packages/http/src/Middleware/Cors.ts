/*
  
  Cross-origin Resource Sharing 
  
  This implementation is copied from https://github.com/expressjs/cors and modified
  for use with the cmdo-http middleware.

 */

import type { IncomingMessage, ServerResponse } from "http";

import type { Middleware } from "../Types";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Options = {
  origin: string;
  methods: string;
  optionsSuccessStatus: number;
};

/*
 |--------------------------------------------------------------------------------
 | Cors
 |--------------------------------------------------------------------------------
 */

export function cors(options: Options = defaultOptions()): Middleware {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const headers = [];
    const method = req.method && req.method.toUpperCase && req.method.toUpperCase();

    if (method === "OPTIONS") {
      // preflight
      headers.push(configureOrigin(options, req));
      headers.push(configureCredentials(options));
      headers.push(configureMethods(options));
      headers.push(configureAllowedHeaders(options, req));
      headers.push(configureMaxAge(options));
      headers.push(configureExposedHeaders(options));

      applyHeaders(headers, res);

      res.statusCode = options.optionsSuccessStatus;
      res.setHeader("Content-Length", "0");
      res.end();
    } else {
      // actual response
      headers.push(configureOrigin(options, req));
      headers.push(configureCredentials(options));
      headers.push(configureExposedHeaders(options));

      applyHeaders(headers, res);
    }
  };
}

/*
 |--------------------------------------------------------------------------------
 | Configurations
 |--------------------------------------------------------------------------------
 */

function configureOrigin(options: any, req: IncomingMessage) {
  const requestOrigin = req.headers.origin;
  const headers = [];

  let isAllowed;

  if (!options.origin || options.origin === "*") {
    // allow any origin
    headers.push([
      {
        key: "Access-Control-Allow-Origin",
        value: "*"
      }
    ]);
  } else if (typeof options.origin === "string") {
    // fixed origin
    headers.push([
      {
        key: "Access-Control-Allow-Origin",
        value: options.origin
      }
    ]);
    headers.push([
      {
        key: "Vary",
        value: "Origin"
      }
    ]);
  } else {
    isAllowed = isOriginAllowed(requestOrigin, options.origin);
    // reflect origin
    headers.push([
      {
        key: "Access-Control-Allow-Origin",
        value: isAllowed ? requestOrigin : false
      }
    ]);
    headers.push([
      {
        key: "Vary",
        value: "Origin"
      }
    ]);
  }

  return headers;
}

function configureCredentials(options: any) {
  if (options.credentials === true) {
    return {
      key: "Access-Control-Allow-Credentials",
      value: "true"
    };
  }
  return null;
}

function configureMethods(options: any) {
  let methods = options.methods;
  if (methods.join) {
    methods = options.methods.join(","); // .methods is an array, so turn it into a string
  }
  return {
    key: "Access-Control-Allow-Methods",
    value: methods
  };
}

function configureAllowedHeaders(options: any, req: IncomingMessage) {
  let allowedHeaders = options.allowedHeaders || options.headers;
  const headers = [];

  if (!allowedHeaders) {
    allowedHeaders = req.headers["access-control-request-headers"]; // .headers wasn't specified, so reflect the request headers
    headers.push([
      {
        key: "Vary",
        value: "Access-Control-Request-Headers"
      }
    ]);
  } else if (allowedHeaders.join) {
    allowedHeaders = allowedHeaders.join(","); // .headers is an array, so turn it into a string
  }

  if (allowedHeaders && allowedHeaders.length) {
    headers.push([
      {
        key: "Access-Control-Allow-Headers",
        value: allowedHeaders
      }
    ]);
  }

  return headers;
}

function configureMaxAge(options: any) {
  const maxAge = (typeof options.maxAge === "number" || options.maxAge) && options.maxAge.toString();
  if (maxAge && maxAge.length) {
    return {
      key: "Access-Control-Max-Age",
      value: maxAge
    };
  }
  return null;
}

function configureExposedHeaders(options: any) {
  let headers = options.exposedHeaders;

  if (!headers) {
    return null;
  } else if (headers.join) {
    headers = headers.join(","); // .headers is an array, so turn it into a string
  }

  if (headers && headers.length) {
    return {
      key: "Access-Control-Expose-Headers",
      value: headers
    };
  }

  return null;
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function defaultOptions(): Options {
  return {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204
  };
}

function isOriginAllowed(origin: any, allowedOrigin: any): boolean {
  if (Array.isArray(allowedOrigin)) {
    for (let i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (typeof allowedOrigin === "string") {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  }
  return !!allowedOrigin;
}

function applyHeaders(headers: any, res: ServerResponse): void {
  for (const header of headers) {
    if (header) {
      if (Array.isArray(header)) {
        applyHeaders(header, res);
      } else if (header.value) {
        res.setHeader(header.key, header.value);
      }
    }
  }
}
