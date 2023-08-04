import { HttpException, Injectable } from '@nestjs/common';
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

  public create(createUserDto: CreateUserDto) {
    return this.userRepository.save({
      ...createUserDto,
      password: sha256(createUserDto.password),
    });
  }

  public findAll() {
    return this.userRepository.find();
  }

  public async findOne(id: string) {
    const user =
      (await this.userRepository.findOneBy({ uuid: id })) ??
      (await this.userRepository.findOneBy({
        id,
      })) ??
      (await this.userRepository.findOneBy({
        email: id,
      }));

    if (!user) throw new HttpException('User not found', 404);

    return user;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updatedUser = await this.userRepository.update(
      {
        uuid: user.uuid,
      },
      {
        ...updateUserDto,
      },
    );

    return updatedUser;
  }

  public async remove(id: string) {
    const user = await this.findOne(id);

    await this.userRepository.delete({
      uuid: user.uuid,
    });

    return 'ok';
  }
}
