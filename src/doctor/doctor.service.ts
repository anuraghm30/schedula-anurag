import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Injectable()
export class DoctorService {
  private doctors: CreateDoctorDto[] = [];

  create(dto: CreateDoctorDto) {
    this.doctors.push(dto);

    return {
      message: 'Doctor profile created successfully',
      profile: dto,
    };
  }

  findAll() {
    return this.doctors;
  }
}