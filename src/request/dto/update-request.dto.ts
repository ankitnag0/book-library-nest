import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RequestStatus } from '../enum';

export class UpdateRequestDto {
  @IsEnum(RequestStatus)
  @IsNotEmpty()
  status: RequestStatus;
}
