import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateOrganizationDto {
  @ApiProperty({ description: '组织名称' })
  @IsNotEmpty()
  @IsString()
  @Length(1,64)
  org_name: string;
  @ApiProperty({ description: '组织编码' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Length(1, 64)
  org_code?: string;
  @ApiProperty({ description: '父组织id' })
  @IsNotEmpty()
  @IsNumber()
  parent_id: number;
  @ApiProperty({ description: '备注' })
  @Length(1, 255)
  @IsString()
  @IsOptional()
  remark?:string;
}
