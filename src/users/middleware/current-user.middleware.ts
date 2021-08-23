import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: any, res: any, next: () => void): Promise<any> {
    const { userId } = req.session || {};

    if (userId) {
      req.currentUser = await this.usersService.findOne(userId);
    }

    next();
  }
}
