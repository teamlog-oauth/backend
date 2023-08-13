import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOAuthDto } from './create-oauth.dto';

export class UpdateOAuthDto extends OmitType(PartialType(CreateOAuthDto), [
  'applicationId',
] as const) {}
