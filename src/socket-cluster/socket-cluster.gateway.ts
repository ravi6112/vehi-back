import { WebSocketGateway } from '@nestjs/websockets';
import * as socketClusterServer from 'socketcluster-server';
import * as http from 'http';

@WebSocketGateway()
export class SocketClusterGateway {
  httpServer: any;
  agServer: any;

  constructor() {
    this.httpServer = http.createServer();
    this.agServer = socketClusterServer.attach(this.httpServer, {});
    this.httpServer.listen(8000);
    console.log('inside the handle connection');
  }

  async handleConnection() {
    console.log('inside the socket clusterhandle connection');
    this.agServer.exchange.transmitPublish(
      'updateChannel',
      'File is uploaded ',
    );
    for await (const { socket, id } of this.agServer.listener('connection')) {
      console.log('Socket is ready ', id);
      for await (const data of socket.receiver('updateChannel')) {
        console.log(data);
        this.agServer.exchange.transmitPublish(
          'updateChannel',
          'This111 is some data from server',
        );
      }
    }
  }
}
