import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateShiftGroupDto } from './dto/create-shift-group.dto';
import { ShiftService } from './shift.service';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftController {
  constructor(private readonly svc: ShiftService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new shift group' })
  create(@Body() dto: CreateShiftGroupDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all shifts (filter by room and/or date)' })
  @ApiQuery({ name: 'room', required: false })
  @ApiQuery({ name: 'date', required: false })
  findAll(@Query('room') room?: string, @Query('date') date?: string) {
    return this.svc.findAll(room, date);
  }

  @Get('reset')
  // placeholder so DELETE /shifts/reset isn't caught by :groupId
  reset_placeholder() { return; }

  @Delete('reset')
  @HttpCode(200)
  @ApiOperation({ summary: 'Clear all mock shifts' })
  reset() {
    return this.svc.reset();
  }

  @Delete(':groupId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a shift group and all its room shifts' })
  deleteGroup(@Param('groupId') groupId: string) {
    return this.svc.deleteGroup(groupId);
  }

  @Get(':groupId/:roomId')
  @ApiOperation({ summary: 'Get a single room shift detail' })
  findOne(@Param('groupId') groupId: string, @Param('roomId') roomId: string) {
    return this.svc.findOne(groupId, roomId);
  }
}