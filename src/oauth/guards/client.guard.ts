import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { ClientData } from 'src/@types/client';
import { OAuthService } from '../oauth.service';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly oauthService: OAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { headers, body } = request;
    const { authorization } = headers;
    const { grant_type } = body;
    if (grant_type === 'authorization_code') {
      if (!authorization) return false;

      const [type, token] = authorization.split(' ');
      if (type !== 'Bearer') return false;

      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [client_id, client_secret] = decoded.split(':');

      await this.oauthService.validateClient(client_id, client_secret);

      request.client = {
        client_id,
        client_secret,
      };
      return true;
    }
    if (grant_type === 'refresh_token') {
      return true;
    }
    return false;
  }
}
