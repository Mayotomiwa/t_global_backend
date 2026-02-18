import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsDateString, IsHexColor, IsOptional,
  IsString, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShiftRoomDto {
  @ApiProperty() @IsString() roomName!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() description!: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) team!: string[];
  @ApiPropertyOptional() @IsOptional() @IsDateString() start?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() end?: string;
}

export class CreateShiftGroupDto {
  @ApiProperty() @IsDateString() date!: string;
  @ApiProperty() @IsDateString() start!: string;
  @ApiProperty() @IsDateString() end!: string;
  @ApiProperty() @IsHexColor() color!: string;
  @ApiProperty({ type: [CreateShiftRoomDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShiftRoomDto)
  rooms!: CreateShiftRoomDto[];
}