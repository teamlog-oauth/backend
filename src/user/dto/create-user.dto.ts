import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's email",
    example: 'op@plebea.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: "The user's id",
    example: 'plebea',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: "The user's name",
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "The user's password",
    example: 'secret',
  })
  @IsString()
  password: string;
}
