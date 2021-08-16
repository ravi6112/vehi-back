import { SocketClusterModule } from './../socket-cluster/socket-cluster.module';
import { AppGateway } from './../app.gateway';
import { VehiclesResolver } from './vehicles.resolver';
import { FileConsumer } from './file.process';
import { VehiclesEntity } from './vehicles.entity';
import { BullModule } from '@nestjs/bull';
import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { SocketClusterGateway } from 'src/socket-cluster/socket-cluster.gateway';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([VehiclesEntity]),
    BullModule.registerQueue({
      name: 'file',
    }),
    CacheModule.register(),
  ],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    FileConsumer,
    VehiclesResolver,
    SocketClusterGateway,
  ],
})
export class VehiclesModule {}
