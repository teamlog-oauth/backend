import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { Request } from 'express';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async create(@Req() req: Request, @Body() body: CreateApplicationDto) {
    return this.applicationService.create(req.user, body);
  }
  @Patch(':uuid')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async update(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body() body: UpdateApplicationDto,
  ) {
    return this.applicationService.update(req.user, uuid, body);
  }

  @Delete(':uuid')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async remove(@Req() req: Request, @Param('uuid') uuid: string) {
    return this.applicationService.remove(req.user, uuid);
  }
}
