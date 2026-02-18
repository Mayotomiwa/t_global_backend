import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftGroupEntity } from './entities/shift-group.entity';
import { ShiftRoomEntity } from './entities/shift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftGroupEntity, ShiftRoomEntity])],
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule { }
