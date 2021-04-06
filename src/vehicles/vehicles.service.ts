import { VehiclesEntity } from './vehicles.entity';
import { vehiclesDto } from './vehicles.dto';
import { InjectQueue } from '@nestjs/bull';
import { HttpService, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import CSV from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, getConnection } from 'typeorm';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectQueue('file') private fileQueue: Queue,
    @InjectRepository(VehiclesEntity)
    private vehiclesRepository: Repository<VehiclesEntity>,
    private connection: Connection,
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

  async storeData(data: vehiclesDto[]) {
    console.log('execution of query');
    console.log(data);
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(VehiclesEntity)
      .values(data)
      .execute();
  }

  async showAll() {
    return this.vehiclesRepository.find();
  }
}
