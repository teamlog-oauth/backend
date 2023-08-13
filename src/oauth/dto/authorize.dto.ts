import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AuthorizeDto {
  @ApiProperty({
    description: 'The ID of the user to authorize',
  })
  id: string;

  @ApiProperty({
    description: 'The password of the user to authorize',
  })
  password: string;
}

/**
 * Data transfer object for the authorization query parameters.
 */
export class AuthorizeQueryDto {
  /**
   * The type of response requested by the client.
   * Can be either 'code' or 'token'.
   */
  @ApiProperty({
    enum: ['code', 'token'],
    description:
      "The type of response requested by the client. Can be either 'code' or 'token'.",
  })
  response_type: 'code' | 'token';

  /**
   * The URI to redirect the user to after authorization is complete.
   */
  @ApiProperty({
    description:
      'The URI to redirect the user to after authorization is complete.',
  })
  redirect_uri: string;

  /**
   * The ID of the client making the authorization request.
   */
  @ApiProperty({
    description: 'The ID of the client making the authorization request.',
  })
  client_id: string;

  /**
   * The scope of the access request.
   */
  @ApiProperty({
    description: 'The scope of the access request.',
    required: false,
  })
  @IsOptional()
  scope?: string;

  /**
   * An optional value that will be returned in the response to the client.
   */
  @ApiProperty({
    description:
      'An optional value that will be returned in the response to the client.',
    required: false,
  })
  @IsOptional()
  state?: string;
}
