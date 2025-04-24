import { Module } from '@nestjs/common';
import { SubscribersEntity } from './entities/subscribers.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { SubscribersRepository } from './repositories/subscribers.repository';

@Module({
	imports: [TypeOrmModule.forFeature([SubscribersEntity])],
	controllers: [SubscribersController],
	providers: [SubscribersService, SubscribersRepository],
	exports: [],
})
export class SubscribersModule {}
