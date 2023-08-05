import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    description: "The user's email or ids",
    example: 'op@plebea.com / plebea',
  })
  @IsString({
    message: '이메일 또는 아이디는 문자열이어야 합니다.',
  })
  @IsNotEmpty({
    message: '이메일 또는 아이디를 입력해주세요.',
  })
  id: string;

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
