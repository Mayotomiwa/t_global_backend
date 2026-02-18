import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreatePublicationDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() summary!: string;
  @ApiProperty() @IsString() content!: string;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];
  @ApiProperty() @IsString() author!: string;
  @ApiProperty() @IsDateString() date!: string;
  @ApiProperty() @IsString() readTime!: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() imageUrl?: string;
}
