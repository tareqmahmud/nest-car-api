import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // Find out the user
    const user = await this.userService.find(email);

    if (user.length) {
      throw new BadRequestException('Email already used');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Signup user
    return await this.userService.create(email, hashedPassword);
  }

  signin(email: string, password: string) {}
}
