import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const user =
      (await this.userService.findOne(body.email, false)) ??
      (await this.userService.findOne(body.id, false));

    if (user)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    return await this.userService.create(body);
  }
}
