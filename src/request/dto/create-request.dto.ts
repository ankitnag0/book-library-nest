import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RequestType } from '../enum';

export class CreateRequestDto {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsEnum(RequestType)
  @IsNotEmpty()
  type: RequestType;
}
