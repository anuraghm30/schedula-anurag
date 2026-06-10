import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';

import { User } from './users/entities/user.entity';
import { Doctor } from './doctor/doctor.entity';
import { Patient } from './patient/patient.entity';

export default new DataSource({
  type: 'postgres',

  url: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  entities: [User, Doctor, Patient],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});