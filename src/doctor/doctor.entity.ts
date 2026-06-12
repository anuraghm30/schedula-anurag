import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../users/entities/user.entity';

import { RecurringAvailability } from '../availability/entities/recurring-availability.entity';
import { CustomAvailability } from '../availability/entities/custom-availability.entity';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  specialization!: string;

  @Column()
  experience!: number;

  @Column()
  qualification!: string;

  @Column()
  consultationFee!: number;

  @Column()
  availability!: string;

  @Column()
  profileDetails!: string;

  @OneToOne(() => User, (user) => user.doctorProfile)
  @JoinColumn()
  user!: User;

  @OneToMany(
    () => RecurringAvailability,
    (availability) => availability.doctor,
  )
  recurringAvailabilities!: RecurringAvailability[];

  @OneToMany(
    () => CustomAvailability,
    (availability) => availability.doctor,
  )
  customAvailabilities!: CustomAvailability[];

  @OneToMany(
    () => Appointment,
    (appointment) => appointment.doctor,
  )
  appointments: Appointment[];
}
