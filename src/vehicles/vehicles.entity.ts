import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vehicles')
export class VehiclesEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column('text')
  id: string;

  @Column('text')
  first_name: string;

  @Column('text')
  last_name: string;

  @Column('text')
  email: string;

  @Column('text')
  car_make: string;

  @Column('text')
  car_model: string;

  @Column('text')
  vin_number: string;

  @Column('date')
  manufactured_date: Date;

  //   @Column('int64')
  //   ageOfVehicle: Int16Array;
}
