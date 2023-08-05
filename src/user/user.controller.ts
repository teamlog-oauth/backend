import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':uuid')
  @UseGuards(AccessGuard)
  update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    if (uuid !== req.user.uuid)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.userService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @UseGuards(AccessGuard)
  remove(@Req() req: Request, @Param('uuid') uuid: string) {
    if (uuid !== req.user.uuid)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.userService.remove(uuid);
  }
}
