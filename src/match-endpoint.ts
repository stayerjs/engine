import { IncomingMessage } from 'http';
import { parse } from 'url';
import {
  Endpoint, HttpMethod, MethodNotAllowed, NotFound, NotImplemented,
} from '@stayer/interfaces';

function compose405(routed: Endpoint[]): MethodNotAllowed {
  const err = new MethodNotAllowed();
  const allowedMethods: HttpMethod[] = [];
  for (const endpoint of routed) {
    allowedMethods.push(endpoint.method);
  }
  err.headers = {
    'Allow': allowedMethods.join(', '),
  };
  return err;
}

function matchEndpoint(endpoints: Endpoint[], req: IncomingMessage): Endpoint {
  if (!Object.values(HttpMethod).includes(req.method as HttpMethod)) {
    throw new NotImplemented(
      `Method ${req.method} is not supported by server.`
    );
  }
  const url = parse(req.url as string);
  const routed = endpoints.filter(x => x.route === url.pathname);
  if (routed.length === 0) {
    throw new NotFound();
  }
  const matched = routed.find(x => x.method === req.method);
  if (!matched) {
    throw compose405(routed);
  }
  return matched;
}

export default matchEndpoint;
