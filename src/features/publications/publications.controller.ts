import {
  Body, Controller, Delete, Get, HttpCode, Param, Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';

@ApiTags('Publications')
@Controller('publications')
export class PublicationsController {
  constructor(private readonly svc: PublicationsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a publication' })
  create(@Body() dto: CreatePublicationDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List publication summaries (homepage)' })
  findAll() {
    return this.svc.findAll();
  }

  @Delete('reset')
  @HttpCode(200)
  @ApiOperation({ summary: 'Clear all mock publications' })
  reset() {
    return this.svc.reset();
  }
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Soft Delete a publication' })
  deletePublication(@Param('id') id: string) {
    return this.svc.deletePublication(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full publication content (article detail)' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}