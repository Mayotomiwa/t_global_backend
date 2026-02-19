import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsDateString, IsHexColor, IsOptional,
  IsString, IsUrl, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TeamMemberDto {
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() imageUrl?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string | null;
}

export class CreateShiftRoomDto {
  @ApiProperty() @IsString() roomName!: string;
  @ApiProperty() @IsHexColor() color!: string;
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() description!: string;
  @ApiProperty({ type: [TeamMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  team!: TeamMemberDto[];
  @ApiPropertyOptional() @IsOptional() @IsUrl() imageUrl?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsDateString() start?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() end?: string;
}

export class CreateShiftGroupDto {
  @ApiProperty() @IsDateString() date!: string;
  @ApiProperty() @IsDateString() start!: string;
  @ApiProperty() @IsDateString() end!: string;
  @ApiProperty({ type: [CreateShiftRoomDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShiftRoomDto)
  shifts!: CreateShiftRoomDto[];
}
