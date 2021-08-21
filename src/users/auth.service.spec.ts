import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { raw } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    // Fake user lists
    const fakeUsers: User[] = [];

    // Create fake service
    fakeUserService = {
      async find(email: string): Promise<User> {
        const user = fakeUsers.find((fakeUser) => fakeUser.email === email);

        return Promise.resolve(user);
      },

      async create(email: string, password: string): Promise<User> {
        const newUser = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        fakeUsers.push(newUser);

        return Promise.resolve(newUser);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should initialize auth service', function () {
    expect(service).toBeDefined();
  });

  it('should create new user', async function () {
    const user: User = await service.signup('test@test.com', 'test');

    expect(user.email).toEqual('test@test.com');
    expect(user.email).not.toEqual('test');
  });

  it('should throw an error is email already available', async function () {
    try {
      await service.signup('test@test.com', 'test');
      await service.signup('test@test.com', 'test');
    } catch (error) {
      expect(error.status).toEqual(400);
    }
  });

  it('should signin with correct email and password', async function () {
    await service.signup('test@test.com', 'test');

    const user = await service.signin('test@test.com', 'test');

    expect(user.email).toEqual('test@test.com');
  });

  it('should throw an error for wrong email', async function () {
    await service.signup('test@test.com', 'test');

    try {
      await service.signin('test@test2.com', 'test');
    } catch (error) {
      expect(error.status).toEqual(404);
    }
  });

  it('should throw an error for wrong password', async function () {
    await service.signup('test@test.com', 'test');

    try {
      await service.signin('test@test.com', 'test2');
    } catch (error) {
      expect(error.status).toEqual(404);
    }
  });
});
