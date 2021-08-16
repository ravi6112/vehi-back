import { WebSocketGateway } from '@nestjs/websockets';
import http from 'http';
const socketServer = require('socketcluster-server');

@WebSocketGateway()
export class AppGateway {
  httpServer: any;
  agServer: any;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    console.log('server is connected');
    this.httpServer = http.createServer();
    this.agServer = socketServer.attach(this.httpServer, {});
    this.httpServer.listen(8000);
  }

  connectionMake() {
    // console.log('server is connected');
    // this.httpServer = http.createServer();
    // this.agServer = socketServer.attach(this.httpServer, {});
  }

  handleConnection() {
    console.log('inside the handle connection');
    // this.httpServer = http.createServer();
    // this.agServer = socketServer.attach(this.httpServer, {});
    // this.httpServer.listen(8000);
    // this.connectionError().then();
    // this.connectionComplete().then();
    (async () => {
      for await (const { socket, id } of this.agServer.listener('connection')) {
        console.log(id);
        // Handle socket connection.
        for await (const data of socket.receiver('customRemoteEvent')) {
          console.log(data);
          console.log('sended');
          this.agServer.exchange.invokePublish(
            'updateChannel',
            'The file is uploaded to Database',
          );

          // socket.transmit("customRemoteEvent", Math.random());
        }
      }
    })();
  }

  // async connectionError() {
  //   for await (const { error } of this.agServer.listener('error')) {
  //     console.log(error);
  //   }
  // }

  // async connectionComplete() {
  //   console.log('sended');
  //   this.agServer.exchange.invokePublish(
  //     'updateChannel',
  //     'This is some data from server',
  //   );
  //   for await (const { socket, id } of this.agServer.listener('connection')) {
  //     console.log('inside the connection complete', id);
  //     console.log(socket.receiver('customRemoteEvent'));
  //     // Handle socket connection.
  //     for await (const data of socket.receiver('customRemoteEvent')) {
  //       console.log(data);

  //       //   // socket.transmit("customRemoteEvent", Math.random());
  //       // }
  //     }
  //   }
  // }
}
