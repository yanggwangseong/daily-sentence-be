import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { SentencesEntity } from './sentences.entity';

@Entity({ name: 'vocabs' })
export class VocabsEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id!: number;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	word!: string;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	definition!: string;

	@ManyToOne(() => SentencesEntity, (sentence) => sentence.vocabs)
	sentence!: SentencesEntity;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp', nullable: false })
	updatedAt!: Date;
}
