// import http from 'http';
// import * as socketServer from 'socketcluster-server';
import socketClusterClient = require('socketcluster-client');

export class AppGateway {
  socket: any;
  constructor() {
    this.socket = socketClusterClient.create({
      hostname: 'localhost',
      port: 8000,
    });
  }

  async onComplete() {
    await this.socket.invoke(
      'updateProc',
      'this is the data coming from backend side',
    );
  }
}
