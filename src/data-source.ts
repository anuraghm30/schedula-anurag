import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';

import { User } from './users/entities/user.entity';
import { Doctor } from './doctor/doctor.entity';
import { Patient } from './patient/patient.entity';

import { RecurringAvailability } from './availability/entities/recurring-availability.entity';
import { CustomAvailability } from './availability/entities/custom-availability.entity';

export default new DataSource({
  type: 'postgres',

  url: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  entities: [User, Doctor, Patient,RecurringAvailability,CustomAvailability],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});