import { VehiclesService } from './vehicles.service';
import { Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/vehicles')
export class VehiclesController {
  constructor(private vehicleService: VehiclesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: editname,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.vehicleService.createTable(file);
  }
}

function editname(req, file, callback) {
  callback(null, file.originalname);
}
