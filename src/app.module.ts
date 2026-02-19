import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShiftModule } from './features/shift/shift.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { PublicationsModule } from './features/publications/publications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRootAsync(typeOrmConfigAsync), ShiftModule, PublicationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
