import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'sentences' })
export class SentencesEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id!: number;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	sentence!: string;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	meaning!: string;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp', nullable: false })
	updatedAt!: Date;
}
