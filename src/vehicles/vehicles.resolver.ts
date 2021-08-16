import { VehiclesEntity } from './vehicles.entity';
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
    const data = await this.vehicleService.showPagination(page, newest);
    console.log('this is the data ', data);
    return data;
  }

  @Query()
  async searchPagination(
    @Args('page') page: number,
    @Args('carModel') carModel: string,
  ) {
    return await this.vehicleService.searchPaginationByElement(page, carModel);
  }

  // @Mutation()
  // async updateVehicle(
  //   @Args('uid') uid: string,
  //   @Args('id') id: string,
  //   @Args('firstName') firstName: string,
  //   @Args('lastName') lastName: string,
  //   @Args('email') email: string,
  //   @Args('carMake') carMake: string,
  //   @Args('carModel') carModel: string,
  //   @Args('vinNumber') vinNumber: string,
  //   @Args('manufacturedDate') manufacturedDate: Date,
  // ) {
  //   const data: Partial<VehiclesDto> = {
  //     id,
  //     firstName,
  //     lastName,
  //     email,
  //     carMake,
  //     carModel,
  //     vinNumber,
  //     manufacturedDate,
  //   };
  //   return await this.vehicleService.updateVehicle(uid, data);
  // }

  // @Mutation()
  // async updateVehicle(@Args('vehicle') vehicle: VehiclesEntity) {
  //   console.log(vehicle);
  //   return vehicle;
  // }

  @Mutation()
  async deleteVehicle(@Args('uid') uid: string) {
    return await this.vehicleService.deleteVehicle(uid);
  }
}
