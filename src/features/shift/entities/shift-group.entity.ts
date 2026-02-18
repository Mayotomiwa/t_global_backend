import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn,
} from 'typeorm';
import { ShiftRoomEntity } from './shift.entity';

@Entity('shift_groups')
export class ShiftGroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'timestamptz' })
  start: string;

  @Column({ type: 'timestamptz' })
  end: string;

  @Column({ length: 7 })
  color: string;

  @OneToMany(() => ShiftRoomEntity, (room) => room.group, {
    cascade: true,
    eager: true,
  })
  rooms: ShiftRoomEntity[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}