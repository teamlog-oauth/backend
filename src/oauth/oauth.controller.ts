import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { Request } from 'express';
import { CreateOAuthDto } from './dto/create-oauth.do';
import { UpdateOAuthDto } from './dto/update-oauth.dto';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Post()
  @UseGuards(AccessGuard)
  async create(@Req() req: Request, @Body() body: CreateOAuthDto) {
    return await this.oauthService.create(req.user, body);
  }

  @Patch(':uuid')
  @UseGuards(AccessGuard)
  async update(@Req() req: Request, @Body() body: UpdateOAuthDto) {
    return this.oauthService.update(req.user, req.params.uuid, body);
  }

  @Delete(':uuid')
  @UseGuards(AccessGuard)
  async delete(@Req() req: Request) {
    return this.oauthService.delete(req.user, req.params.uuid);
  }
}
