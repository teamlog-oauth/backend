import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth } from './entities/oauth.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { AuthorizeQueryDto } from './dto/authorize.dto';
import { ManageService } from 'src/manage/manage.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import ms from 'ms';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(OAuth)
    private readonly oauthRepository: Repository<OAuth>,
    private readonly manageService: ManageService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public generateAuthorizationCode(query: AuthorizeQueryDto, user: User) {
    const { redirect_uri, response_type, scope, client_id } = query;

    const code = crypto.randomBytes(16).toString('hex');

    this.cacheManager.set(
      `oauth:code:${code}`,
      {
        scope,
        client_id,
        user_id: user.id,
      },
      ms('5m'),
    );

    return code;
  }

  public async validateAuthorizeQuery(
    authorizeQueryDto: AuthorizeQueryDto,
    baseUrl: string,
  ) {
    const { redirect_uri, client_id } = authorizeQueryDto;

    const oauth = await this.manageService.findOne(client_id);

    if (!oauth.redirectUri.includes(redirect_uri))
      throw new HttpException('Invalid redirect uri', HttpStatus.UNAUTHORIZED);

    if (!oauth.authorizationUri.includes(baseUrl))
      throw new HttpException(
        'Invalid authorization uri',
        HttpStatus.UNAUTHORIZED,
      );
  }

  public async validateClient(client_id: string, client_secret: string) {
    const oauth = await this.manageService.findOne(client_id);
    return oauth.clientSecret === client_secret;
  }

  public async validateAuthorizationCode(
    clientId: string,
    code: string,
  ): Promise<false | string> {
    const data: any = await this.cacheManager.get(`oauth:code:${code}`);
    if (!data) return false;
    if (data.client_id !== clientId) return false;

    return data.user_id;
  }

  public async generateRefreshToken(user_id: string) {
    const token = await this.jwtService.signAsync(
      { id: user_id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    this.userRepository.update(
      {
        id: user_id,
      },
      {
        refreshToken: token,
      },
    );

    return token;
  }

  public async generateAccessToken(user_id: string) {
    const token = await this.jwtService.signAsync(
      { id: user_id },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      },
    );

    return token;
  }

  public async generateAccessTokenByRefreshToken(refresh_token: string) {
    const user = await this.userRepository.findOneBy({
      refreshToken: refresh_token,
    });

    if (!user) return false;

    const token = await this.generateAccessToken(user.id);

    return token;
  }
}
