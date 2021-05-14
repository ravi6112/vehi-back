import { VehiclesDto } from './vehicles.dto';
import { VehiclesService } from './vehicles.service';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

@Resolver('Vehicles')
export class VehiclesResolver {
  constructor(private vehicleService: VehiclesService) {}

  @Query()
  async vehicles() {
    return await this.vehicleService.showAll();
  }

  @Query()
  async vehiclesPagination(
    @Args('page') page: number,
    @Args('newest') newest: boolean,
  ) {
    return await this.vehicleService.showPagination(page, newest);
  }

  @Query()
  async searchPagination(
    @Args('page') page: number,
    // @Args('uid') uid: string,
    // @Args('id') id: string,
    // @Args('first_name') first_name: string,
    // @Args('last_name') last_name: string,
    // @Args('email') email: string,
    // @Args('car_make') car_make: string,
    @Args('car_model') car_model: string,
    // @Args('vin_number') vin_number: string,
    // @Args('manufactured_date') manufactured_date: Date,
  ) {
    return await this.vehicleService.searchPaginationByElement(page, car_model);
  }

  @Mutation()
  async updateVehicle(
    @Args('uid') uid: string,
    @Args('id') id: string,
    @Args('first_name') first_name: string,
    @Args('last_name') last_name: string,
    @Args('email') email: string,
    @Args('car_make') car_make: string,
    @Args('car_model') car_model: string,
    @Args('vin_number') vin_number: string,
    @Args('manufactured_date') manufactured_date: Date,
  ) {
    const data: Partial<VehiclesDto> = {
      id,
      first_name,
      last_name,
      email,
      car_make,
      car_model,
      vin_number,
      manufactured_date,
    };
    return await this.vehicleService.updateVehicle(uid, data);
  }

  @Mutation()
  async deleteVehicle(@Args('uid') uid: string) {
    return await this.vehicleService.deleteVehicle(uid);
  }
}
