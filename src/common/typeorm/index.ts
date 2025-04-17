import { ConfigModule, ConfigService } from '@nestjs/config';

import {
	TypeOrmModuleAsyncOptions,
	TypeOrmModuleOptions as TypeOrmModuleOptionsType,
} from '@nestjs/typeorm';
import { PoolOptions } from 'mysql2';
import { LogLevel } from 'typeorm';
import path from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import {
	ENV_DB_DATABASE,
	ENV_DB_HOST,
	ENV_DB_PASSWORD,
	ENV_DB_PORT,
	ENV_DB_SYNCHRONIZE,
	ENV_DB_TYPE,
	ENV_DB_USERNAME,
} from '../constants/env-keys.const';

export const TypeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (
		configService: ConfigService,
	): Promise<TypeOrmModuleOptionsType> => {
		const option = {
			type: configService.get(ENV_DB_TYPE) || 'mysql',
			host: configService.get(ENV_DB_HOST) || 'localhost',
			port: Number(configService.get<number>(ENV_DB_PORT)) || 3306,
			username: configService.get(ENV_DB_USERNAME) || 'root',
			database: configService.get(ENV_DB_DATABASE) || 'test',
			password: configService.get(ENV_DB_PASSWORD) || 'test',
			entities: [path.resolve(process.cwd(), 'dist/**/*.entity.{js,ts}')],
			synchronize: configService.get<boolean>(ENV_DB_SYNCHRONIZE) || true,
			extra: {
				connectionLimit: 50,
				waitForConnections: true,
				queueLimit: 0,
				enableKeepAlive: true,
				keepAliveInitialDelay: 10000,
				idleTimeout: 240000,
			} satisfies PoolOptions,

			maxQueryExecutionTime: 1000,

			...(configService.get('NODE_ENV') === 'development'
				? {
						retryAttempts: 10,
						logging: ['query', 'error', 'warn'] satisfies LogLevel[],
					}
				: { logging: ['error', 'warn'] satisfies LogLevel[] }),
		} satisfies MysqlConnectionOptions;

		return option;
	},
};
