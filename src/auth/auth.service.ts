import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { SignupDto } from './dto/signup.dto';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  private users: User[] = [];
  private id = 1;

  async signup(signupDto: SignupDto) {
    const existingUser = this.users.find(
      (user) => user.email === signupDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user: User = {
      id: this.id++,
      name: signupDto.name,
      email: signupDto.email,
      password: hashedPassword,
      role: signupDto.role,
    };

    this.users.push(user);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  getUsers() {
    return this.users;
  }
}