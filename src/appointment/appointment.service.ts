import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Appointment } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,

    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(dto: CreateAppointmentDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const patient = await this.patientRepository.findOne({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const existingAppointment =
      await this.appointmentRepository.findOne({
        where: {
          doctor: { id: dto.doctorId },
          appointmentDate: dto.appointmentDate,
          appointmentTime: dto.appointmentTime,
          status: 'BOOKED',
        },
      });

    if (existingAppointment) {
      throw new BadRequestException(
        'Slot already booked',
      );
    }

    const appointment =
      this.appointmentRepository.create({
        appointmentDate: dto.appointmentDate,
        appointmentTime: dto.appointmentTime,
        status: 'BOOKED',
        doctor,
        patient,
      });

    return this.appointmentRepository.save(
      appointment,
    );
  }

  async getDoctorAppointments(
    doctorId: number,
  ) {
    return this.appointmentRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      relations: [
        'doctor',
        'patient',
      ],
    });
  }

  async cancelAppointment(id: number) {
    const appointment =
      await this.appointmentRepository.findOne({
        where: { id },
      });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    appointment.status = 'CANCELLED';

    return this.appointmentRepository.save(
      appointment,
    );
  }
}