import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(
    dto: CreateDoctorDto,
    userId: number,
  ) {
    try {
      const existingDoctor = await this.doctorRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

      if (existingDoctor) {
        return {
          message: 'Doctor profile already exists',
        };
      }

      const doctor = this.doctorRepository.create(dto);

      doctor.user = { id: userId } as any;

      await this.doctorRepository.save(doctor);

      return {
        message: 'Doctor profile created successfully',
        profile: doctor,
      };
    } catch (error) {
      console.error('CREATE DOCTOR ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to create doctor profile',
      );
    }
  }

  async findOneByUserId(userId: number) {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

      if (!doctor) {
        return {
          message: 'Doctor profile not found',
        };
      }

      return doctor;
    } catch (error) {
      console.error('FIND DOCTOR BY USER ID ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to fetch doctor profile',
      );
    }
  }

  async update(
    dto: UpdateDoctorDto,
    userId: number,
  ) {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
        relations: ['user'],
      });

      if (!doctor) {
        return {
          message: 'Doctor profile not found',
        };
      }

      Object.assign(doctor, dto);

      await this.doctorRepository.save(doctor);

      return {
        message: 'Doctor profile updated successfully',
        profile: doctor,
      };
    } catch (error) {
      console.error('UPDATE DOCTOR ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to update doctor profile',
      );
    }
  }

  async getDoctors(
    specialization?: string,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    try {
      page = Number(page);
      limit = Number(limit);

      if (page < 1 || limit < 1) {
        throw new BadRequestException(
          'Page and limit must be greater than 0',
        );
      }

      const query = this.doctorRepository.createQueryBuilder('doctor');

      if (specialization) {
        query.andWhere(
          'LOWER(doctor.specialization) = LOWER(:specialization)',
          { specialization },
        );
      }

      if (search) {
        query.andWhere(
          'LOWER(doctor.fullName) LIKE LOWER(:search)',
          {
            search: `%${search}%`,
          },
        );
      }

      const total = await query.getCount();

      query.skip((page - 1) * limit);
      query.take(limit);

      const doctors = await query.getMany();

      if (!doctors.length) {
        return {
          message: 'No doctors found',
          data: [],
          total,
        };
      }

      return {
        page,
        limit,
        total,
        data: doctors,
      };
    } catch (error) {
      console.error('GET DOCTORS ERROR:', error);
      throw new InternalServerErrorException(
        'Failed to fetch doctors',
      );
    }
  }

  async getDoctorById(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(
          'Invalid doctor id',
        );
      }

      const doctor = await this.doctorRepository.findOne({
        where: { id },
      });

      if (!doctor) {
        throw new NotFoundException(
          'Doctor not found',
        );
      }

      return doctor;
    } catch (error) {
      console.error('GET DOCTOR BY ID ERROR:', error);
      throw error;
    }
  }
}