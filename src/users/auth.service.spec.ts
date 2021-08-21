import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

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
});
