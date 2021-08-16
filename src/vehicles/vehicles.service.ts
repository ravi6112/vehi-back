import { VehiclesEntity } from './vehicles.entity';
import { VehiclesDto } from './vehicles.dto';
import { InjectQueue } from '@nestjs/bull';
import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Queue } from 'bull';
import CSV from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

@Injectable()
export class VehiclesService {
  result: VehiclesDto[] = [];
  constructor(
    @InjectQueue('file') private fileQueue: Queue,
    @InjectRepository(VehiclesEntity)
    private vehiclesRepository: Repository<VehiclesEntity>,
    private httpService: HttpService,
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
        .on('data', (data: any) => {
          results.push(data);
        })
        .on('end', () => {
          // console.log(results);
          this.addQueue(results);
        });
    }
  }

  async addQueue(data: any[]) {
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
      return Promise.reject(new Error('error throwing'));
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async showAll() {
    // return this.vehiclesRepository.find();
    const body = `
    { 
      allVehicles { nodes {
        uid
        firstName
        email
        lastName
        carMake
        carModel
        vinNumber
        manufacturedDate
        id
        
      }
    }
  }`;

    const output = await this.httpService
      .post('http://localhost:5000/graphql', body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe(({ data }) => {
        console.log(data);
        this.result = data;
      });
    console.log(this.result);
    return this.result;
  }

  async showPagination(page = 1, newest?: boolean) {
    console.log(page);
    const postQuery = `
    query MyQuery {
      allVehicles(first: 25, orderBy: CAR_MODEL_ASC, offset: ${
        25 * (page - 1)
      }) {
        nodes {
          firstName
          id
          email
          carModel
          carMake
          lastName
          manufacturedDate
          nodeId
          uid
          vinNumber
        }
      }
    }
    `;

    return this.httpService
      .post('http://localhost:5000/graphql', postQuery, {
        headers: { 'Content-Type': 'application/graphql' },
      })
      .toPromise()
      .then(({ data }) => data.data.allVehicles.nodes);
  }

  async updateVehicle(uid: string, data: Partial<VehiclesDto>) {
    const postQuery = `
  mutation MyMutation {
    updateVehicleByUid(
      input: {vehiclePatch: {
        manufacturedDate: "${data.manufacturedDate}", 
        email: "${data.email}", 
        firstName: "${data.firstName}", 
        id: "${data.id}", 
        vinNumber: "${data.vinNumber}", 
        carModel: "${data.carModel}", 
        carMake: "${data.carMake}", 
        lastName: "${data.lastName}"
      }, 
        uid: "${uid}"}
    ) {
      vehicle {
        carMake
        carModel
        email
        firstName
        id
        lastName
        manufacturedDate
        uid
        vinNumber
      }
    }
  }`;

    return this.httpService
      .post('http://localhost:5000/graphql', postQuery, {
        headers: { 'Content-Type': 'application/graphql' },
      })
      .toPromise()
      .then(({ data }) => data.data.updateVehicleByUid.vehicle);
  }

  async deleteVehicle(uid: string) {
    const postQuery = `
    mutation MyMutation {
      deleteVehicleByUid(input: {uid: "${uid}"}) {
        vehicle {
          id
          uid
        }
      }
    }`;

    return this.httpService
      .post('http://localhost:5000/graphql', postQuery, {
        headers: { 'Content-Type': 'application/graphql' },
      })
      .toPromise()
      .then(({ data }) => data.data.deleteVehicleByUid.vehicle);
  }

  async searchPaginationByElement(page: number, carModel: string) {
    const postQuery = `
    query MyQuery {
      searchPosts(search: "${carModel}", first: 25, offset: ${
      25 * (page - 1)
    }) {
        nodes {
          firstName
          id
          email
          carModel
          carMake
          lastName
          manufacturedDate
          uid
          vinNumber
        }
      }
    }
    `;

    console.log(postQuery);

    return this.httpService
      .post('http://localhost:5000/graphql', postQuery, {
        headers: { 'Content-Type': 'application/graphql' },
      })
      .toPromise()
      .then(({ data }) => data.data.searchPosts.nodes);
  }
}
