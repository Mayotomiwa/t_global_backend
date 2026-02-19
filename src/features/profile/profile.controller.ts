import {
  Body, Controller, Delete, Get, HttpCode, Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly svc: ProfileService) { }

  @Get()
  @ApiOperation({ summary: 'Get the profile' })
  get() {
    return this.svc.get();
  }

  @Put()
  @ApiOperation({ summary: 'Update the profile' })
  update(@Body() dto: CreateProfileDto) {
    return this.svc.update(dto);
  }

  @Delete('reset')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset profile to seed data' })
  reset() {
    return this.svc.reset();
  }
}
