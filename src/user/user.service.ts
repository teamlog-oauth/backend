import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { sha256 } from 'src/utils/encrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: sha256(createUserDto.password),
    });

    return this.userRepository.save(newUser);
  }

  public findAll() {
    return this.userRepository.find();
  }

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public async findOne(id: string, error: boolean = true) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.applications', 'application')
      .where('user.id = :id', { id })
      .orWhere('user.email = :id', { id })
      .getOne();

    if (!user && error)
      throw new HttpException('User not founds', HttpStatus.NOT_FOUND);

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updatedUser = await this.userRepository.update(
      {
        id,
      },
      {
        ...updateUserDto,
      },
    );

    return updatedUser;
  }

  public async remove(id: string) {
    await this.findOne(id);

    await this.userRepository.delete({
      id,
    });

    return 'ok';
  }
}
