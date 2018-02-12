import { IncomingMessage, ServerResponse } from 'http';
import { Endpoint, HttpListener } from '@stayer/interfaces';

import matchEndpoint from './match-endpoint';
import parseJsonBody from './parse-json-body';
import handleHttpError from './handle-http-error';

async function execute(endpoints: Endpoint[], req: IncomingMessage, res: ServerResponse) {
  const endpoint = matchEndpoint(endpoints, req);
  const fn = await endpoint.fn$;
  const body = await parseJsonBody(req);
  const result = await fn(req, res, body);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export default function performRequest(endpoints: Endpoint[]): HttpListener {
  return (req: IncomingMessage, res: ServerResponse) => {
    execute(endpoints, req, res).catch(handleHttpError(res));
  }
}
