import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('publications')
export class PublicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array' })
  tags: string[];

  @Column()
  author: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  readTime: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}