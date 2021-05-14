import { AppGateway } from './../app.gateway';
import { VehiclesEntity } from './vehicles.entity';
import { VehiclesDto } from './vehicles.dto';
import { InjectQueue } from '@nestjs/bull';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import CSV from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, getRepository } from 'typeorm';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectQueue('file') private fileQueue: Queue,
    @InjectRepository(VehiclesEntity)
    private vehiclesRepository: Repository<VehiclesEntity>,
    private appGateway: AppGateway,
  ) {}

  async createTable(file: Express.Multer.File) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    const results = [];
    if (path.extname(file.originalname) == '.csv') {
      console.log('inside if condition path line');
      const csv = fs
        .createReadStream('./uploads/' + file.originalname)
        .pipe(CSV())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          // console.log(results);
          this.addQueue(results);
        });
    }
  }

  async addQueue(data) {
    const job = await this.fileQueue.add('vehicles', data);
    console.log('created job ');
    return true;
  }

  async storeData(data: VehiclesDto[]) {
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(VehiclesEntity)
        .values(data)
        .execute();
      console.log('csv is uploaded to database');
      this.appGateway.onComplete();
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async showAll() {
    return this.vehiclesRepository.find();
  }

  async showPagination(page = 1, newest?: boolean) {
    return this.vehiclesRepository.find({
      take: 25,
      skip: 25 * (page - 1),
    });
  }

  async updateVehicle(uid: string, data: Partial<VehiclesDto>) {
    let vehicle = await this.vehiclesRepository.findOne({ where: { uid } });
    if (!vehicle) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.vehiclesRepository.update({ uid }, data);
    vehicle = await this.vehiclesRepository.findOne({ where: { uid } });
    return vehicle;
  }

  async deleteVehicle(uid: string) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { uid } });
    if (!vehicle) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await this.vehiclesRepository.delete({ uid });
    return vehicle;
  }

  async searchPaginationByElement(
    page: number,
    carModel: string,
    // vinNumber: string,
    // manufacturedDate: Date,
  ) {
    try {
      return await getRepository(VehiclesEntity)
        .createQueryBuilder('vehicle')
        .take(25)
        .skip(25 * (page - 1))
        .where('vehicle.car_model like :car_model', {
          car_model: `${carModel}%`,
        })
        .getMany();
    } catch (err) {
      console.log(err);
    }
  }
}
