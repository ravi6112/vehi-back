import { BullModule } from '@nestjs/bull';
import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SocketClusterModule } from './socket-cluster/socket-cluster.module';

@Module({
  imports: [
    VehiclesModule,
    HttpModule,
    TypeOrmModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    SocketClusterModule,
    CacheModule.register(),
    // PostGraphileModule.forRoot({
    //   pgConfig: process.env.DATABASE_URL,
    //   playground: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
