import { UserService } from '../service/user.service';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { hasRoles } from 'auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'auth/guards/jwt-gward';
import { RolesGuard } from 'auth/guards/roles_guards';
import { IUser } from 'user/model/user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() user: IUser): Promise<IUser | object> {
    try {
      const newUser = await this.userService.create(user);
      return newUser;
    } catch (err) {
      return { error: err.message };
    }
  }

  @Post('login')
  async login(@Body() user: IUser): Promise<object> {
    const jwtToken = await this.userService.login(user);
    console.log(jwtToken);
    return { access_token: jwtToken, date: new Date() };
  }
  @Get(':id')
  async findOne(@Param() params): Promise<IUser> {
    return await this.userService.findOne(params.id);
  }
  //-------------findAll
  @hasRoles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: IUser,
  ): Promise<void> {
    console.log('user inside controller', user);
    await this.userService.updateOne(id, user);
  }
}
