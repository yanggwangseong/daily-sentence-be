import { Injectable } from '@nestjs/common';
import { VideosEntity } from '../entities/videos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VideosRepository extends Repository<VideosEntity> {
	constructor(
		@InjectRepository(VideosEntity)
		private readonly repository: Repository<VideosEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
