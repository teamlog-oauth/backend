import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessGuard } from './guards/access.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RefreshGuard } from './guards/refresh.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { SigninDto } from './dto/signin.dto';
import { sha256 } from 'src/utils/encrypt';
import { REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS } from 'src/utils/cookie';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  check(@Req() req: Request) {
    return req.user;
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request) {
    if (!req.user)
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);

    return await this.authService.generateAccessToken(req.user.uuid);
  }

  @Post('signin')
  async signin(@Body() body: SigninDto, @Res() res: Response) {
    const { id, password } = body;

    const user = await this.userService.findOne(id);

    if (sha256(password) !== user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    res.cookie(
      REFRESH_COOKIE_NAME,
      await this.authService.generateRefreshToken(user.uuid),
      REFRESH_COOKIE_OPTIONS,
    );
    res.status(HttpStatus.OK).send('ok');
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const user =
      (await this.userService.findOne(body.email, false)) ??
      (await this.userService.findOne(body.id, false));

    if (user)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    return await this.userService.create(body);
  }

  @Post('signout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async signout(@Req() req: Request, @Res() res: Response) {
    const { Refresh } = req.cookies;

    if (!Refresh)
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);

    await this.authService.removeRefreshToken(req.user.uuid);

    res.clearCookie(REFRESH_COOKIE_NAME);
    res.status(HttpStatus.OK).send('ok');
  }
}
