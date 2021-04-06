import { IsDate, IsInt, IsString } from 'class-validator';

export class vehiclesDto {
  @IsString()
  uuid: string;

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
  manufactruedDate: Date;

//   @IsInt()
//   ageOfVehicle: Int16Array;
}
