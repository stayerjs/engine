import { ServerResponse } from 'http';
import { HttpMethod } from '@stayer/interfaces';

/*const headers = [
  'Accept',
  'Accept-Encoding',
  'Accept-Language',
  'Authorization',
];*/

export default function cors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', Object.values(HttpMethod).join(', '));
}
