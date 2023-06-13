import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveOrganizationDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsNumber()
  parent_id: number;
}
