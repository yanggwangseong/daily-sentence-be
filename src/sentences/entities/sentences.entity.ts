import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { VideosEntity } from "./videos.entity";
import { VocabsEntity } from "./vocabs.entity";

@Entity({ name: "sentences" })
export class SentencesEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "varchar", nullable: false, length: 100 })
    sentence!: string;

    @Column({ type: "varchar", nullable: false, length: 100 })
    meaning!: string;

    @OneToMany(() => VocabsEntity, (vocab) => vocab.sentence)
    vocabs!: VocabsEntity[];

    @OneToOne(() => VideosEntity, (video) => video.sentence)
    @JoinColumn()
    video!: VideosEntity;

    @CreateDateColumn({ type: "timestamp", nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp", nullable: false })
    updatedAt!: Date;
}
