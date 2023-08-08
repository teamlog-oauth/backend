import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth } from './entities/oauth.entity';
import { Repository } from 'typeorm';
import { CreateOAuthDto } from './dto/create-oauth.do';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { UpdateOAuthDto } from './dto/update-oauth.dto';

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(OAuth)
    private readonly oauthRepository: Repository<OAuth>,
    private readonly userService: UserService,
  ) {}

  private generateClientId() {
    return `${crypto.randomBytes(16).toString('hex')}.apps.teamlog.com`;
  }

  private generateClientSecret() {
    return crypto.randomBytes(32).toString('hex');
  }

  public async create(user: Express.User, createOAuthDto: CreateOAuthDto) {
    const applications = (await this.userService.findOne(user.uuid))
      .applications;
    if (
      !applications
        .map(({ uuid }) => uuid)
        .includes(createOAuthDto.applicationId)
    )
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);

    const oauth = this.oauthRepository.create({
      application: {
        uuid: createOAuthDto.applicationId,
      },
      clientId: this.generateClientId(),
      clientSecret: this.generateClientSecret(),
      ...createOAuthDto,
    });

    return await this.oauthRepository.save(oauth);
  }

  public async update(
    user: Express.User,
    uuid: string,
    updateOAuthDto: UpdateOAuthDto,
  ) {
    const applications = (await this.userService.findOne(user.uuid))
      .applications;

    if (!applications.map((value) => value.oauth.uuid).includes(uuid))
      throw new HttpException('OAuth not found', HttpStatus.NOT_FOUND);

    const oauth = await this.oauthRepository.findOneBy({ uuid });

    return await this.oauthRepository.save({
      ...oauth,
      ...updateOAuthDto,
    });
  }

  public async delete(user: Express.User, uuid: string) {
    const applications = (await this.userService.findOne(user.uuid))
      .applications;

    if (!applications.map((value) => value.oauth.uuid).includes(uuid))
      throw new HttpException('OAuth not found', HttpStatus.NOT_FOUND);

    return await this.oauthRepository.delete(uuid);
  }
}
