import { VehiclesService } from './vehicles.service';
import { Resolver, Query } from '@nestjs/graphql';

@Resolver('Vehicles')
export class VehiclesResolver {
  constructor(private vehicleService: VehiclesService) {}

  @Query()
  vehicles() {
    return this.vehicleService.showAll();
  }
}
