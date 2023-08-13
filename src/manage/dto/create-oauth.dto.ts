import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateOAuthDto {
  @ApiProperty({
    description: 'The ID of the application',
    example: 'abc123',
  })
  @IsString({
    message: 'applicationId must be a string',
  })
  @IsNotEmpty({
    message: 'applicationId is required',
  })
  applicationId: string;

  @ApiProperty({
    description: 'An array of redirect URIs',
    example: ['https://example.com/callback', 'https://example.com/redirect'],
  })
  @IsArray({
    message: 'redirectUri must be an array',
  })
  @IsNotEmpty({
    message: 'redirectUri is required',
  })
  @Transform(({ value }) => {
    return JSON.stringify(value);
  })
  redirectUri: string[];

  @ApiProperty({
    description: 'An array of authorization URIs',
    example: ['https://example.com'],
  })
  @IsArray({
    message: 'authorizationUri must be an array',
  })
  @IsNotEmpty({
    message: 'authorizationUri is required',
  })
  authorizationUri: string[];

  @ApiProperty({
    description: 'An array of OAuth scopes',
    example: ['read', 'write'],
  })
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
