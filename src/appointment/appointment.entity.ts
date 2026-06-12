import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appointmentDate: string;

  @Column()
  appointmentTime: string;

  @Column({
    default: 'BOOKED',
  })
  status: string;

  @ManyToOne(
    () => Doctor,
    (doctor) => doctor.appointments,
    {
      onDelete: 'CASCADE',
    },
  )
  doctor: Doctor;

  @ManyToOne(
    () => Patient,
    (patient) => patient.appointments,
    {
      onDelete: 'CASCADE',
    },
  )
  patient: Patient;
}