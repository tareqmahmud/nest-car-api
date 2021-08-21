import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   * Service for creating a new user
   *
   * @param email
   * @param password
   */
  async create(email: string, password: string) {
    const user = await this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  /**
   * Service for fetch a user by id
   *
   * @param id
   */
  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      // Bad practice: Move http protocol errors to controller
      throw new NotFoundException('Sorry no user has been found with this id');
    }

    return user;
  }

  /**
   * Service for fetch a user by email
   *
   * @param email
   */
  async find(email: string) {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      // Bad practice: Move http protocol errors to controller
      throw new NotFoundException('Sorry no user has been found with this id');
    }

    return user;
  }

  /**
   * Server for update a user
   *
   * @param id
   * @param attrs
   */
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      // Bad practice: Move http protocol errors to controller
      throw new NotFoundException('Sorry no user has been found with this id');
    }

    // Update existing property with available new property
    Object.assign(user, attrs);

    // Save and return new updated user
    return this.userRepository.save(user);
  }

  /**
   * Service for remove a user
   *
   * @param id
   */
  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      // Bad practice: Move http protocol errors to controller
      throw new NotFoundException('Sorry no user has been found with this id');
    }

    return this.userRepository.remove(user);
  }
}
