import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  public async findAll(user: Express.User) {
    return this.applicationRepository.find({
      relations: ['user'],
      where: { user },
    });
  }

  public async create(
    user: Express.User,
    createApplicationDto: CreateApplicationDto,
  ) {
    const application = this.applicationRepository.create({
      ...createApplicationDto,
      user,
    });
    return this.applicationRepository.save(application);
  }

  public async update(
    user: Express.User,
    uuid: string,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    const application = await this.applicationRepository.findOne({
      relations: ['user'],
      where: { uuid, user },
    });
    if (!application)
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    return this.applicationRepository.save({
      ...application,
      ...updateApplicationDto,
    });
  }

  public async remove(user: Express.User, uuid: string) {
    const application = await this.applicationRepository.findOne({
      relations: ['user'],
      where: { uuid, user },
    });
    if (!application)
      throw new HttpException('Application not found', HttpStatus.NOT_FOUND);
    return this.applicationRepository.remove(application);
  }
}
