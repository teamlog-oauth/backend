import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async generateAccessToken(uuid: string) {
    const user = await this.userService.findOne(uuid);

    return await this.jwtService.signAsync(user, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  public async generateRefreshToken(uuid: string) {
    await this.userService.findOne(uuid);

    const exists = await this.cacheManager.get(`refresh-${uuid}`);
    if (exists) return exists;

    const token = await this.jwtService.signAsync(
      {
        uuid,
      },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      },
    );

    await this.cacheManager.set(
      `refresh-${uuid}`,
      token,
      1000 * 60 * 60 * 24 * 7,
    );

    return token;
  }

  public async validateRefreshToken(uuid: string, refreshToken: string) {
    try {
      const token = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      return (
        token.uuid === uuid && (await this.cacheManager.get(`refresh-${uuid}`))
      );
    } catch {
      return false;
    }
  }

  public async removeRefreshToken(uuid: string) {
    await this.cacheManager.del(`refresh-${uuid}`);
  }
}
