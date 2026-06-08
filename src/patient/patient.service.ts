import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  private patients: CreatePatientDto[] = [];

  create(dto: CreatePatientDto) {
    this.patients.push(dto);

    return {
      message: 'Patient profile created successfully',
      profile: dto,
    };
  }

  findAll() {
    return this.patients;
  }
}