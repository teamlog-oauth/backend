import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessStrategy } from './strategies/access.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { OAuth } from 'src/oauth/entities/oauth.entity';
import { ManageService } from 'src/manage/manage.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy, UserService, ManageService],
})
export class AuthModule {}
