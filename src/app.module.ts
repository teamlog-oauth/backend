import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { configValidationSchema } from './validate/conifg.validate';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ApplicationModule } from './application/application.module';
import { OAuthModule } from './oauth/oauth.module';
import { ManageModule } from './manage/manage.module';
import { JwtModule } from '@nestjs/jwt';
import ms from 'ms';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configValidationSchema,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ApplicationModule,
    OAuthModule,
    ManageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
