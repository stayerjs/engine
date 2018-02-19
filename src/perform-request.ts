import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { Endpoint, HttpMethod, HttpListener } from '@stayer/interfaces';

import matchEndpoint from './match-endpoint';
import parseJsonBody from './parse-json-body';
import handleHttpError from './handle-http-error';
import cors from './cors';

async function execute(endpoints: Endpoint[], req: IncomingMessage, res: ServerResponse) {
  const endpoint = matchEndpoint(endpoints, req);
  const fn = await endpoint.fn$;
  const body = await parseJsonBody(req);
  const query: object = parse(req.url as string, true).query;
  const result = await fn(req, res, body, query);
  // TODO: response content type
  res.setHeader('Content-Type', 'application/json');
  // TODO: CORS
  cors(res);
  res.end(JSON.stringify(result));
}

export default function performRequest(endpoints: Endpoint[]): HttpListener {
  return (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === HttpMethod.OPTIONS) {  // TODO: improve OPTIONS handling
      res.statusCode = 200;
      // TODO: CORS
      cors(res);
      res.end();
    } else {
      execute(endpoints, req, res).catch(handleHttpError(res));
    }
  }
}
