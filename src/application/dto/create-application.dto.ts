import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    example: '팀로그',
    description: '이름',
  })
  @IsString({
    message: '이름은 문자열로 입력해주세요.',
  })
  @IsNotEmpty({
    message: '이름은 필수 입력입니다.',
  })
  name: string;
}
