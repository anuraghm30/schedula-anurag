import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { DoctorController } from './doctor/doctor.controller';
import { PatientController } from './patient/patient.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root123',
      database: 'schedula',

      synchronize: true,      // ← change this
      autoLoadEntities: true,
    }),

    AuthModule,
    UsersModule,
  ],
  controllers: [
    AppController,
    DoctorController,
    PatientController,
  ],
  providers: [AppService],
})
export class AppModule {}