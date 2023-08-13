import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ManageService } from './manage.service';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CreateOAuthDto } from './dto/create-oauth.dto';
import { UpdateOAuthDto } from './dto/update-oauth.dto';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('manage')
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  @Post()
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async create(@Req() req: Request, @Body() body: CreateOAuthDto) {
    return await this.manageService.create(req.user, body);
  }

  @Patch(':uuid')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async update(@Req() req: Request, @Body() body: UpdateOAuthDto) {
    return this.manageService.update(req.user, req.params.uuid, body);
  }

  @Delete(':uuid')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async delete(@Req() req: Request) {
    return this.manageService.delete(req.user, req.params.uuid);
  }
}
