import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's email",
    example: 'op@plebea.com',
  })
  @IsEmail(
    {},
    {
      message: '이메일 형식이 올바르지 않습니다.',
    },
  )
  @IsNotEmpty({
    message: '이메일을 입력해주세요.',
  })
  email: string;

  @ApiProperty({
    description: "The user's id",
    example: 'plebea',
  })
  @IsString({
    message: '아이디는 문자열이어야 합니다.',
  })
  @IsNotEmpty({
    message: '아이디를 입력해주세요.',
  })
  id: string;

  @ApiProperty({
    description: "The user's name",
    example: 'John Doe',
  })
  @IsString({
    message: '이름은 문자열이어야 합니다.',
  })
  @IsNotEmpty({
    message: '이름을 입력해주세요.',
  })
  name: string;

  @ApiProperty({
    description: "The user's password",
    example: 'secret',
  })
  @IsString({
    message: '비밀번호는 문자열이어야 합니다.',
  })
  @IsNotEmpty({
    message: '비밀번호를 입력해주세요.',
  })
  password: string;
}
