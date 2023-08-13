import { Module } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { OAuthController } from './oauth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuth } from './entities/oauth.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ManageService } from 'src/manage/manage.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([OAuth, User]), JwtModule],
  controllers: [OAuthController],
  providers: [OAuthService, UserService, ManageService],
})
export class OAuthModule {}
