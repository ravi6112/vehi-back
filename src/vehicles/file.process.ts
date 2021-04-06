import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { VehiclesService } from './vehicles.service';

@Processor('file')
export class FileConsumer {
  constructor(private vehicleService: VehiclesService) {}

  @Process('vehicles')
  handleVehicles(job: Job) {
    console.log('process is coming with job');
    this.vehicleService.storeData(job.data);
  }
}
