import { Module } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ManageController } from './manage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { OAuth } from 'src/oauth/entities/oauth.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([OAuth, User])],
  controllers: [ManageController],
  providers: [ManageService, UserService],
})
export class ManageModule {}
