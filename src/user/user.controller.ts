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

  @Patch(':id')
  @UseGuards(AccessGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    if (id !== req.user.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  remove(@Req() req: Request, @Param('id') id: string) {
    if (id !== req.user.id)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.userService.remove(id);
  }
}
