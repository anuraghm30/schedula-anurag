import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from './users/entities/user.entity';
import { Doctor } from './doctor/doctor.entity';
import { Patient } from './patient/patient.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root123',
  database: 'schedula',

  entities: [User, Doctor, Patient],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});