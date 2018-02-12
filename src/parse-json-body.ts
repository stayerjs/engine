import { IncomingMessage } from 'http';

function parseJsonBody(req: IncomingMessage): Promise<object> {
  return new Promise((resolve, reject) => {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });
    req.on('end', () => {
      (rawBody === '') ? resolve() : resolve(JSON.parse(rawBody))
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

export default parseJsonBody;
