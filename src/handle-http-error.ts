import { ServerResponse } from 'http';
import { HttpError } from '@stayer/interfaces';

import cors from './cors';

export default function handleHttpError(res: ServerResponse) {
  return (err: HttpError) => {
    const message = {
      code: err.code,
      name: err.name,
      message: err.message || undefined,
    };
    res.statusCode = err.code;
    res.setHeader('Content-Type', 'application/json');
    cors(res);
    Object.keys(err.headers)
      .map(header => res.setHeader(header, err.headers[header]));
    res.end(JSON.stringify(message));
  }
}
