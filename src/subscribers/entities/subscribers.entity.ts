import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Index(["email"], { unique: true })
@Entity({ name: "subscribers" })
export class SubscribersEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "varchar", nullable: false, length: 100 })
    email!: string;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
