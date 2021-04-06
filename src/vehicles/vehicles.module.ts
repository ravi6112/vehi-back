import { VehiclesResolver } from './vehicles.resolver';
import { FileConsumer } from './file.process';
import { VehiclesEntity } from './vehicles.entity';
import { BullModule } from '@nestjs/bull';
import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([VehiclesEntity]),
    BullModule.registerQueue({
      name: 'file',
    }),
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService, FileConsumer, VehiclesResolver],
})
export class VehiclesModule {}
