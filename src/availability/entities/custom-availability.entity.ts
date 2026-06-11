import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../../doctor/doctor.entity';

@Entity()
export class CustomAvailability {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @ManyToOne(
    () => Doctor,
    (doctor) => doctor.customAvailabilities,
    {
      onDelete: 'CASCADE',
    },
  )
  doctor!: Doctor;
}