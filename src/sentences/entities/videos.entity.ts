import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { SentencesEntity } from './sentences.entity';

@Entity({ name: 'videos' })
export class VideosEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id!: number;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	videoUrl!: string;

	@OneToOne(() => SentencesEntity, (sentence) => sentence.video)
	sentence!: SentencesEntity;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp', nullable: false })
	updatedAt!: Date;
}
