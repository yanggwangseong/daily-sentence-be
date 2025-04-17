import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'vocabs' })
export class VocabsEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id!: number;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	word!: string;

	@Column({ type: 'varchar', nullable: false, length: 100 })
	definition!: string;

	@CreateDateColumn({ type: 'timestamp', nullable: false })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp', nullable: false })
	updatedAt!: Date;
}
