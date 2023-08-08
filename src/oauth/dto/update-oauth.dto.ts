import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOAuthDto } from './create-oauth.do';

export class UpdateOAuthDto extends OmitType(PartialType(CreateOAuthDto), [
  'applicationId',
] as const) {}
