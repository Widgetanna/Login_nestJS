import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from 'user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJWT(user: IUser): Promise<string> {
    return await this.jwtService.signAsync({ user });
  }
  public async verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(
    newPassword: string | undefined | null,
    hashedPassword: string | undefined | null,
  ): Promise<boolean> {
    if (!newPassword || !hashedPassword) {
      return false;
    }

    try {
      return await bcrypt.compare(newPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
}
