import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IUser } from 'user/model/user.interface';
import { UserService } from 'user/service/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  //on bloque dans la route guard user
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const user: IUser = request.user;
    return this.userService.findOne(user.id).then((foundUser: IUser | null) => {
      if (!foundUser) {
        throw new UnauthorizedException('Invalid user');
      }

      const hasRole = roles.includes(foundUser.role);
      let hasPermission: boolean = false;
      if (hasRole) {
        hasPermission = true;
      }

      return user && hasPermission;
    });
  }
}
