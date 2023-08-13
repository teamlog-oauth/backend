import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GrantTokenDto } from './dto/grant-token.dto';
import { AuthorizeDto, AuthorizeQueryDto } from './dto/authorize.dto';
import { sha256 } from 'src/utils/encrypt';
import { UserService } from 'src/user/user.service';
import { ClientGuard } from './guards/client.guard';
import { ConfigService } from '@nestjs/config';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  check(@Req() req: Request) {
    return req.user;
  }

  @Post('authorize')
  async signin(
    @Req() req: Request,
    @Body() body: AuthorizeDto,
    @Res() res: Response,
    @Query() query: AuthorizeQueryDto,
  ) {
    const { id, password } = body;
    const { redirect_uri, response_type, state } = query;

    await this.oauthService.validateAuthorizeQuery(query, req.headers.origin);

    const user = await this.userService.findOne(id);

    if (sha256(password) !== user.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    switch (response_type) {
      case 'code':
        const authorizationCode = this.oauthService.generateAuthorizationCode(
          query,
          user,
        );

        return void res
          .status(HttpStatus.OK)
          .redirect(
            `${redirect_uri}?code=${authorizationCode}` +
              (state ? `&state=${state}` : ''),
          );
      case 'token':
        throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
    }
  }

  @Post('token')
  @ApiBearerAuth()
  @UseGuards(ClientGuard)
  async token(@Req() req: Request, @Body() body: GrantTokenDto) {
    const { client_id } = req.client;
    const { grant_type, code, refresh_token } = body;

    if (grant_type === 'refresh_token') {
      return {
        access_token: await this.oauthService.generateAccessTokenByRefreshToken(
          refresh_token,
        ),
        token_type: 'Bearer',
        expires_in: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      };
    }
    if (grant_type === 'authorization_code') {
      const user_id = await this.oauthService.validateAuthorizationCode(
        client_id,
        code,
      );
      if (!user_id)
        throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);

      return {
        access_token: await this.oauthService.generateAccessToken(user_id),
        token_type: 'Bearer',
        expires_in: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
        refresh_token: await this.oauthService.generateRefreshToken(user_id),
      };
    }
    throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
