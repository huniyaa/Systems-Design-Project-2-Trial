import app from './server.js';
import { createServer } from 'http';

const server = createServer(app);

export default server;
