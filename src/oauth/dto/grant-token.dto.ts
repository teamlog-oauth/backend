import { ApiProperty } from '@nestjs/swagger';

export class GrantTokenDto {
  @ApiProperty({
    description: 'The type of grant being requested',
    enum: ['authorization_code', 'refresh_token'],
    example: 'authorization_code',
  })
  grant_type: 'authorization_code' | 'refresh_token';

  @ApiProperty({
    description:
      'The authorization code received from the authorization server',
    example: 'abc123',
  })
  code?: string;

  @ApiProperty({
    description: 'The refresh token received from the authorization server',
    example: 'xyz789',
  })
  refresh_token?: string;

  @ApiProperty({
    description:
      'The URI to redirect to after the authorization code is received',
    example: 'https://example.com/callback',
  })
  redirect_uri?: string;
}
