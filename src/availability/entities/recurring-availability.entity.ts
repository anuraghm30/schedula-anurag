import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Doctor } from '../../doctor/doctor.entity';

@Entity()
export class RecurringAvailability {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dayOfWeek!: string;

  @Column()
  startTime!: string;

  @Column()
  endTime!: string;

  @ManyToOne(
    () => Doctor,
    (doctor) => doctor.recurringAvailabilities,
    {
      onDelete: 'CASCADE',
    },
  )
  doctor!: Doctor;
}