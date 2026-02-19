import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { ShiftGroupEntity } from './shift-group.entity';

export interface TeamMember {
  name: string;
  imageUrl: string | null;
}

@Entity('shift_rooms')
export class ShiftRoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  roomName!: string;

  @Column({ length: 7 })
  color!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'jsonb' })
  team!: TeamMember[];

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  start!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  end!: string | null;

  @ManyToOne(() => ShiftGroupEntity, (group) => group.shifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId' })
  group!: ShiftGroupEntity;

  @Column({ nullable: true })
  groupId!: string;
}
