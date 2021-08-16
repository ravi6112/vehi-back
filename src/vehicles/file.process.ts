import { SocketClusterGateway } from './../socket-cluster/socket-cluster.gateway';
import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueError,
  OnQueueStalled,
} from '@nestjs/bull';
import { Job } from 'bull';
import { VehiclesService } from './vehicles.service';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Processor('file')
export class FileConsumer {
  constructor(
    private vehicleService: VehiclesService,
    private socketClusterGateway: SocketClusterGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Process('vehicles')
  async handleVehicles(job: Job) {
    console.log('process is coming with job');
    await this.cacheManager.set('key', 'value', { ttl: 10000 });
    return this.vehicleService.storeData(job.data);
    // this.socketClusterGateway.handleConnection();
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log('queue is completed upload completed');
    this.socketClusterGateway.handleConnection();
  }

  @OnQueueFailed()
  handler(job: Job, err: Error) {
    console.log('failed error - ', err);
  }

  @OnQueueError()
  handlerError(err: Error) {
    console.log('inside the error function and annotated - ', err);
  }

  @OnQueueStalled()
  handleStalled(job: Job) {
    console.log('inside the stalled queue is done');
  }
}
