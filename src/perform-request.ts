import { IncomingMessage, ServerResponse } from 'http';
import { Endpoint, HttpListener } from '@stayer/interfaces';

import matchEndpoint from './match-endpoint';
import handleHttpError from './handle-http-error';

async function execute(endpoints: Endpoint[], req: IncomingMessage, res: ServerResponse) {
  const endpoint = matchEndpoint(endpoints, req);
  //const service = await endpoint.service;
  const fn = await endpoint.fn$;
  await fn(req, res);
  //await (service as any)[endpoint.propertyName](req, res);
}

export default function performRequest(endpoints: Endpoint[]): HttpListener {
  return (req: IncomingMessage, res: ServerResponse) => {
    execute(endpoints, req, res).catch(handleHttpError(res));
  }
}
