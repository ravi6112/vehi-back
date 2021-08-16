import { IsDate, IsString } from 'class-validator';

export class VehiclesDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  carMake: string;

  @IsString()
  carModel: string;

  @IsString()
  vinNumber: string;

  @IsDate()
  manufacturedDate: Date;

//   @IsInt()
//   ageOfVehicle: Int16Array;
}
