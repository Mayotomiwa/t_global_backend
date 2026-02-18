import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PublicationEntity } from '../features/publications/entities/publication.entity';
import { ShiftGroupEntity } from '../features/shift/entities/shift-group.entity';
import { ShiftRoomEntity } from '../features/shift/entities/shift.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    useFactory: () => ({
        type: 'postgres' as const,
        url: process.env.DATABASE_URL,
        entities: [ShiftGroupEntity, ShiftRoomEntity, PublicationEntity],
        synchronize: process.env.NODE_ENV !== 'production',
        ssl:
            process.env.NODE_ENV === 'production'
                ? { rejectUnauthorized: false }
                : false,
        logging: process.env.NODE_ENV !== 'production',
    }),
};