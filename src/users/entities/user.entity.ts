import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { OneToOne } from 'typeorm';
import { Doctor } from '../../doctor/doctor.entity';
import { Patient } from '../../patient/patient.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role!: Role;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctorProfile!: Doctor;

  @OneToOne(() => Patient, (patient) => patient.user)
  patientProfile!: Patient;
}