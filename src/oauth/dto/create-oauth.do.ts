import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOAuthDto {
  @IsString({
    message: 'applicationId must be a string',
  })
  @IsNotEmpty({
    message: 'applicationId is required',
  })
  applicationId: string;

  @IsArray({
    message: 'redirectUris must be an array',
  })
  @IsNotEmpty({
    message: 'redirectUris is required',
  })
  @Transform(({ value }) => {
    return JSON.stringify(value);
  })
  redirectUris: string[];

  @IsArray({
    message: 'scopes must be an array',
  })
  @IsNotEmpty({
    message: 'scopes is required',
  })
  @Transform(({ value }) => {
    return JSON.stringify(value);
  })
  scopes: string[];
}
