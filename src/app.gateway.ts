import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway(4001)
export class AppGateway {
  @WebSocketServer() wss: any;

  handleConnection(client: any) {
    client.emit('connection', 'Successfully connected to server');
  }
}
