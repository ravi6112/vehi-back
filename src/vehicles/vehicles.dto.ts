import { IsDate, IsString } from 'class-validator';

export class VehiclesDto {
  @IsString()
  id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsString()
  car_make: string;

  @IsString()
  car_model: string;

  @IsString()
  vin_number: string;

  @IsDate()
  manufactured_date: Date;

//   @IsInt()
//   ageOfVehicle: Int16Array;
}
