import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { PublicationEntity } from '../features/publications/entities/publication.entity';
import { ShiftGroupEntity } from '../features/shift/entities/shift-group.entity';
import { ShiftRoomEntity } from '../features/shift/entities/shift.entity';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [ShiftGroupEntity, ShiftRoomEntity, PublicationEntity],
    migrations: ['dist/migrations/*.js'],
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
});