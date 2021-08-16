import { Module } from '@nestjs/common';
import { SocketClusterGateway } from './socket-cluster.gateway';

@Module({
  imports: [],
  providers: [SocketClusterGateway],
})
export class SocketClusterModule {}
