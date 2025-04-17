import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

@Entity({ name: 'visits' })
@Unique(['ip', 'date']) // 중복 방지: 같은 날짜에 동일 IP로는 한 번만 기록
export class VisitsEntity {
	@PrimaryGeneratedColumn({ type: 'int' })
	id!: number;

	@Column({ type: 'varchar', length: 45, nullable: false }) // IPv6 대응
	ip!: string;

	@Column({ type: 'date', nullable: false })
	date!: string; // 'YYYY-MM-DD' 형식

	@CreateDateColumn({ type: 'timestamp' })
	createdAt!: Date;
}
